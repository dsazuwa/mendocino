import { sign } from 'jsonwebtoken';
import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '@App/db';

import {
  Admin,
  AdminAccount,
  AdminRole,
  Customer,
  CustomerAccount,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  Email,
  ProviderType,
  Role,
} from '@user/models';
import { USER_SCHEMA } from '@user/utils/constants';

type JWTProviderType = ProviderType | 'email';

const getUserIdForUser = async (email: string, transaction?: Transaction) => {
  const schema = USER_SCHEMA;

  const query = `
      SELECT
        CASE
          WHEN EXISTS (
            SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id
          ) THEN ua.admin_id
          ELSE ca.customer_id
        END AS "userId",
        EXISTS (
          SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id
        ) AS "isAdmin"
      FROM
        ${schema}.${AdminAccount.tableName} ua
      FULL JOIN
        ${schema}.${CustomerAccount.tableName} ca ON ua.email_id = ca.email_id
      JOIN
        ${schema}.${Email.tableName} e ON ua.email_id = e.email_id OR ca.email_id = e.email_id
      WHERE
        e.email = '${email}';`;

  const result = await sequelize.query(query, {
    type: QueryTypes.SELECT,
    transaction,
  });

  return result.length === 0
    ? null
    : (result[0] as { userId: number; isAdmin: boolean });
};

const authService = {
  generateJWT: (email: string, provider: JWTProviderType) =>
    sign({ email, provider }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    }),

  getUserFromPayload: async (email: string, provider: JWTProviderType) => {
    const schema = USER_SCHEMA;

    const query =
      provider === 'email'
        ? `
        WITH UserRole AS (
          SELECT
            CASE
              WHEN EXISTS (
                SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id
              ) THEN ua.admin_id
              ELSE ca.customer_id
            END AS user_id,
            EXISTS (
              SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id
            ) AS is_admin,
            e.email
          FROM
            ${schema}.${AdminAccount.tableName} ua
          FULL JOIN
            ${schema}.${CustomerAccount.tableName} ca ON ua.email_id = ca.email_id
          JOIN
            ${schema}.${Email.tableName} e ON ua.email_id = e.email_id OR ca.email_id = e.email_id
          WHERE
            e.email = '${email}'
        )
        SELECT
          CASE WHEN ur.is_admin THEN a.admin_id ELSE c.customer_id END AS "userId",
          CASE WHEN ur.is_admin THEN a.first_name ELSE c.first_name END AS "firstName",
          CASE WHEN ur.is_admin THEN a.last_name ELSE c.last_name END AS "lastName",
          ur.email AS email,
          CASE WHEN ur.is_admin THEN aa.status::text ELSE ca.status::text END AS status,
          CASE WHEN ur.is_admin THEN array_agg(DISTINCT r.name) ELSE ARRAY['customer'] END AS roles
        FROM
          UserRole ur
        LEFT JOIN
          ${schema}.${Admin.tableName} a ON a.admin_id = ur.user_id
        LEFT JOIN
          ${schema}.${AdminAccount.tableName} aa ON aa.admin_id = a.admin_id
        LEFT JOIN
          ${schema}.${AdminRole.tableName} ar ON ar.admin_id = a.admin_id
        LEFT JOIN
          ${schema}.${Role.tableName} r ON r.role_id = ar.role_id
        LEFT JOIN
          ${schema}.${Customer.tableName} c ON c.customer_id = ur.user_id
        LEFT JOIN
          ${schema}.${CustomerAccount.tableName} ca ON ca.customer_id = c.customer_id
        GROUP BY
          ur.is_admin, ur.email, a.admin_id, c.customer_id, aa.status, ca.status;`
        : `
        SELECT
          c.customer_id AS "userId",
          c.first_name AS "firstName",
          c.last_name AS "lastName",
          e.email AS email,
          ca.status AS status,
          ARRAY['customer'] AS roles
        FROM
          ${schema}.${Customer.tableName} c
        JOIN
          ${schema}.${CustomerAccount.tableName} ca ON ca.customer_id = c.customer_id
        JOIN
          ${schema}.${Email.tableName} e ON e.email_id = ca.email_id
        JOIN
          ${schema}.${CustomerIdentity.tableName} ci ON ci.customer_id = c.customer_id AND ci.provider = '${provider}'
        WHERE
          e.email = '${email}';`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? undefined : (result[0] as Express.User);
  },

  getUserData: async (userId: number, userType: 'customer' | 'admin') => {
    const schema = USER_SCHEMA;

    const query =
      userType === 'customer'
        ? `
        SELECT
          u.customer_id AS "userId",
          u.first_name AS "firstName",
          u.last_name AS "lastName",
          e.email AS email,
          a.status AS status,
          ARRAY['customer'] AS roles
        FROM
          ${schema}.${Customer.tableName} u
        JOIN
          ${schema}.${CustomerAccount.tableName} a ON u.customer_id = a.customer_id
        JOIN
          ${schema}.${Email.tableName} e ON a.email_id = e.email_id
        WHERE
          u.customer_id = ${userId};`
        : `
        SELECT
          u.admin_id AS "userId",
          u.first_name AS "firstName",
          u.last_name AS "lastName",
          e.email AS email,
          a.status AS status,
          array_agg(DISTINCT r.name) AS roles
        FROM
          ${schema}.${Admin.tableName} u
        JOIN
          ${schema}.${AdminAccount.tableName} a ON u.admin_id = a.admin_id
        JOIN
          ${schema}.${Email.tableName} e ON a.email_id = e.email_id
        JOIN
          ${schema}.${AdminRole.tableName} ur ON u.admin_id = ur.admin_id
        JOIN
          ${schema}.${Role.tableName} r ON r.role_id = ur.role_id
        WHERE
          u.admin_id = ${userId}
        GROUP BY
          u.admin_id, u.first_name, u.last_name, a.status, e.email;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? undefined : (result[0] as Express.User);
  },

  getUserForSocialAuthentication: async (
    identityId: string,
    provider: ProviderType,
    email: string,
  ) => {
    const schema = USER_SCHEMA;

    type QueryReturnType = {
      user: Express.User;
      isAdmin: boolean;
      identityExists: boolean;
    };

    const query = `
      WITH UserRole AS (
        SELECT
          CASE WHEN EXISTS (SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id) 
            THEN ua.admin_id
            ELSE ca.customer_id 
          END AS user_id,
          EXISTS (SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id) AS is_admin
        FROM
          ${schema}.${AdminAccount.tableName} ua
        FULL JOIN
          ${schema}.${CustomerAccount.tableName} ca ON ua.email_id = ca.email_id
        JOIN
          ${schema}.${Email.tableName} e ON ua.email_id = e.email_id OR ca.email_id = e.email_id
        WHERE
          e.email = '${email}'
      )
      SELECT
        ur.is_admin AS "isAdmin",
        CASE WHEN ur.is_admin THEN FALSE ELSE u.identity_exists END AS "identityExists",
        CASE WHEN ur.is_admin 
          THEN NULL
          ELSE json_build_object(
            'userId', u.user_id,
            'firstName', u.first_name,
            'lastName', u.last_name,
            'email', u.email,
            'status', u.status,
            'roles', u.roles)
        END AS user
      FROM UserRole ur
      FULL JOIN (
        SELECT
          u.customer_id AS user_id,
          u.first_name AS first_name,
          u.last_name AS last_name,
          e.email AS email,
          a.status AS status,
          CASE WHEN i.identity_id IS NOT NULL THEN TRUE ELSE FALSE END AS identity_exists,
          ARRAY['customer'] AS roles
        FROM
          ${schema}.${Customer.tableName} u
        JOIN
          ${schema}.${CustomerAccount.tableName} a ON u.customer_id = a.customer_id
        JOIN
          ${schema}.${Email.tableName} e ON a.email_id = e.email_id
        LEFT JOIN
          ${schema}.${CustomerIdentity.tableName} i ON u.customer_id = i.customer_id AND (i.provider = '${provider}' AND i.identity_id = '${identityId}')
        WHERE
          e.email = '${email}' OR (i.identity_id = '${identityId}' AND u.customer_id = i.customer_id)
      ) u ON u.user_id = ur.user_id;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (result.length === 0)
      return {
        user: null,
        isAdmin: false,
        identityExists: false,
      };

    if (result.length > 1)
      return {
        user: null,
        isAdmin: false,
        identityExists: true,
      };

    return result[0] as QueryReturnType;
  },

  getUserIdForUser,

  createIdentityForCustomer: (
    identityId: string,
    customerId: number,
    status: string,
    provider: ProviderType,
  ) =>
    sequelize.transaction(async (transaction) => {
      if (status === 'pending') {
        await CustomerAccount.update(
          { status: 'active' },
          { where: { customerId }, transaction },
        );
      }

      const identity = await CustomerIdentity.create(
        { identityId, customerId, provider },
        { transaction },
      );

      return identity;
    }),

  createCustomerAndIdentity: (
    identityId: string,
    firstName: string,
    lastName: string,
    email: string,
    provider: ProviderType,
  ) =>
    sequelize.transaction(async (transaction) => {
      const { customerId } = await Customer.create(
        { firstName, lastName },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerAccount.create(
        { customerId, emailId, status: 'active' },
        { transaction },
      );

      const identity = await CustomerIdentity.create(
        { identityId, customerId, provider },
        { transaction },
      );

      return identity;
    }),

  createCustomer: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) =>
    sequelize.transaction(async (transaction) => {
      const { customerId } = await Customer.create(
        { firstName, lastName },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerAccount.create(
        { customerId, emailId, status: 'pending' },
        { transaction },
      );

      await CustomerPassword.create({ customerId, password }, { transaction });

      await CustomerOTP.destroy({
        where: { customerId, type: 'email' },
        transaction,
      });

      const otp = '12345';

      await CustomerOTP.create(
        {
          customerId,
          type: 'email',
          password: otp,
          expiresAt: CustomerOTP.getExpiration(),
        },
        { transaction },
      );

      return { customerId, password: otp };
    }),

  loginUser: (email: string, password: string) =>
    sequelize.transaction(async (transaction) => {
      const result = await getUserIdForUser(email, transaction);

      if (!result) return null;

      if (result.isAdmin) {
        const adminId = result.userId;

        const account = await AdminAccount.findOne({
          where: { adminId },
          transaction,
        });

        const isUser = account !== null && account.comparePasswords(password);
        return isUser ? adminId : null;
      }

      const customerId = result.userId;

      const account = await CustomerAccount.findOne({
        where: { customerId },
        raw: true,
        transaction,
      });

      const customerPassword = await CustomerPassword.findOne({
        where: { customerId },
        transaction,
      });

      const isUser =
        account !== null &&
        customerPassword !== null &&
        customerPassword.comparePasswords(password);

      return isUser ? customerId : null;
    }),

  recoverCustomerPassword: (customerId: number, password: string) =>
    sequelize.transaction(async (transaction) => {
      await CustomerOTP.destroy({
        where: { customerId, type: 'password' },
        transaction,
      });

      await CustomerPassword.update(
        { password },
        {
          where: { customerId },
          individualHooks: true,
          transaction,
        },
      );
    }),

  reactivateCustomer: async (customerId: number) => {
    const result = await CustomerAccount.update(
      { status: 'active' },
      { where: { customerId, status: 'deactivated' } },
    );

    return result[0] === 1;
  },
};

export default authService;
