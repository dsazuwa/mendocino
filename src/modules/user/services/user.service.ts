import { QueryTypes, Transaction } from 'sequelize';

import sequelize from '@App/db';

import {
  Admin,
  AdminAccount,
  AdminRole,
  Customer,
  CustomerAccount,
  CustomerIdentity,
  CustomerPassword,
  Email,
  ProviderType,
  Role,
} from '@user/models';
import { USER_SCHEMA } from '@user/utils/constants';
import { Request } from 'express';

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

const userService = {
  getUserDataFromReq: async (req: Request) => {
    const u = req.user;

    return u
      ? {
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          status: u.status,
          roles: u.roles,
        }
      : null;
  },

  getUserFromPayload: async (
    email: string,
    provider: ProviderType | 'email',
  ) => {
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

  getUserIdForUser,

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

  getUserForRecovery: async (email: string) => {
    const schema = USER_SCHEMA;

    const query = `

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
      ur.is_admin AS "isAdmin",
      CASE WHEN ur.is_admin THEN a.admin_id ELSE c.customer_id END AS "userId",
      CASE WHEN ur.is_admin THEN a.first_name ELSE c.first_name END AS "firstName",
      CASE WHEN ur.is_admin THEN a.last_name ELSE c.last_name END AS "lastName",
      ur.email AS email,
      CASE
        WHEN ur.is_admin THEN TRUE
        ELSE CASE WHEN cp.password IS NULL THEN FALSE ELSE TRUE END
      END AS "hasPassword",
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
    LEFT JOIN
      ${schema}.${CustomerPassword.tableName} cp ON cp.customer_id = c.customer_id
    GROUP BY
      ur.is_admin, ur.email, a.admin_id, c.customer_id, cp.password, aa.status, ca.status;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0
      ? undefined
      : (result[0] as Express.User & {
          isAdmin: boolean;
          hasPassword: boolean;
        });
  },
};

export default userService;
