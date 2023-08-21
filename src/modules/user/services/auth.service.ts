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
    WITH UserWithEmail AS (
      SELECT
        CASE
          WHEN EXISTS (SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id) THEN
            ua.admin_id
          ELSE
            ca.customer_id
        END AS user_id,
        EXISTS (SELECT 1 FROM ${schema}.${Admin.tableName} WHERE admin_id = ua.admin_id) AS is_admin
      FROM
        ${schema}.${AdminAccount.tableName} ua
        FULL JOIN ${schema}.${CustomerAccount.tableName} ca ON ua.email_id = ca.email_id
        JOIN ${schema}.${Email.tableName} e ON ua.email_id = e.email_id OR ca.email_id = e.email_id
      WHERE
        e.email = '${email}')
    SELECT
      user_id AS "userId",
      is_admin AS "isAdmin"
    FROM
      UserWithEmail;`;

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

    const query = `
      SELECT
        u.customer_id AS "userId",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        e.email AS email,
        a.status AS status,
        i.identity_id AS "identityId",
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
      GROUP BY
        u.customer_id, u.first_name, u.last_name, e.email, a.status, i.identity_id;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });
    const user =
      result.length === 0
        ? undefined
        : (result[0] as Express.User & { identityId: string });

    if (user === undefined)
      return {
        user: undefined,
        identityExists: false,
      };

    if (user.email !== email)
      return {
        user: undefined,
        identityExists: true,
      };

    const identityExists = user.identityId !== null;

    return {
      user: user as Express.User,
      identityExists,
    };
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
      { where: { customerId, status: 'disabled' } },
    );

    return result[0] === 1;
  },
};

export default authService;
