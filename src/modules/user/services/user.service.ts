import { Request } from 'express';
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
import { USER_SCHEMA, VIEWS } from '@user/utils/constants';

const userService = {
  getUserIdForUser: async (email: string, transaction?: Transaction) => {
    const query = `
    SELECT
      user_id AS "userId",
      is_admin AS "isAdmin",
      email AS email
    FROM
      ${USER_SCHEMA}.${VIEWS.USER_TYPE}
    WHERE
      email = '${email}';`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      transaction,
    });

    return result.length === 0
      ? null
      : (result[0] as { userId: number; isAdmin: boolean; email: string });
  },

  getUserData: async (userId: number, isAdmin: boolean) => {
    const query = isAdmin
      ? `
        SELECT
          u.admin_id AS "userId",
          u.first_name AS "firstName",
          u.last_name AS "lastName",
          e.email AS email,
          a.status AS status,
          array_agg(DISTINCT r.name) AS roles
        FROM
          ${USER_SCHEMA}.${Admin.tableName} u
        JOIN
          ${USER_SCHEMA}.${AdminAccount.tableName} a ON u.admin_id = a.admin_id AND a.admin_id = ${userId}
        JOIN
          ${USER_SCHEMA}.${Email.tableName} e ON a.email_id = e.email_id
        JOIN
          ${USER_SCHEMA}.${AdminRole.tableName} ur ON u.admin_id = ur.admin_id
        JOIN
          ${USER_SCHEMA}.${Role.tableName} r ON r.role_id = ur.role_id
        GROUP BY
          u.admin_id, u.first_name, u.last_name, a.status, e.email;`
      : `
        SELECT
          u.customer_id AS "userId",
          u.first_name AS "firstName",
          u.last_name AS "lastName",
          e.email AS email,
          a.status AS status,
          ARRAY['customer'] AS roles
        FROM
          ${USER_SCHEMA}.${Customer.tableName} u
        JOIN
          ${USER_SCHEMA}.${CustomerAccount.tableName} a ON a.customer_id = u.customer_id AND a.customer_id = ${userId}
        JOIN
          ${USER_SCHEMA}.${Email.tableName} e ON a.email_id = e.email_id;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? undefined : (result[0] as Express.User);
  },

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
    const table =
      provider === 'email'
        ? 'users.get_user_by_email($email)'
        : 'users.get_customer_from_payload($email, $provider)';

    const query = `
      SELECT
        user_id AS "userId",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        status,
        roles
      FROM ${table};`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { email, provider },
    });

    return result.length === 0 ? undefined : (result[0] as Express.User);
  },

  getUserForSocialAuthentication: async (
    identityId: string,
    provider: ProviderType,
    email: string,
  ) => {
    const query = `
      WITH ut AS (
        SELECT user_id, is_admin, email
        FROM ${USER_SCHEMA}.${VIEWS.USER_TYPE}
        WHERE email = '${email}'
      )
      SELECT
        ut.is_admin AS "isAdmin",
        CASE WHEN ut.is_admin THEN FALSE ELSE u.identity_exists END AS "identityExists",
        CASE WHEN ut.is_admin 
          THEN NULL
          ELSE json_build_object(
            'userId', u.user_id,
            'firstName', u.first_name,
            'lastName', u.last_name,
            'email', u.email,
            'status', u.status,
            'roles', u.roles)
        END AS user
      FROM ut
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
          ${USER_SCHEMA}.${Customer.tableName} u
        JOIN
          ${USER_SCHEMA}.${CustomerAccount.tableName} a ON u.customer_id = a.customer_id
        JOIN
          ${USER_SCHEMA}.${Email.tableName} e ON a.email_id = e.email_id
        LEFT JOIN
          ${USER_SCHEMA}.${CustomerIdentity.tableName} i ON u.customer_id = i.customer_id
        WHERE
          e.email = '${email}' OR (i.identity_id = '${identityId}' AND i.provider = '${provider}')
      ) u ON u.user_id = ut.user_id;`;

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

    return result[0] as {
      user: Express.User;
      isAdmin: boolean;
      identityExists: boolean;
    };
  },

  getUserForRecovery: async (email: string) => {
    const query = `
      WITH u AS (
        SELECT user_id, is_admin, email
        FROM ${USER_SCHEMA}.${VIEWS.USER_TYPE}
        WHERE email = '${email}'
      )
      SELECT
        u.is_admin AS "isAdmin",
        CASE WHEN u.is_admin THEN a.admin_id ELSE c.customer_id END AS "userId",
        CASE WHEN u.is_admin THEN a.first_name ELSE c.first_name END AS "firstName",
        CASE WHEN u.is_admin THEN a.last_name ELSE c.last_name END AS "lastName",
        u.email AS email,
        CASE
          WHEN u.is_admin THEN TRUE
          ELSE CASE WHEN cp.password IS NULL THEN FALSE ELSE TRUE END
        END AS "hasPassword",
        CASE WHEN u.is_admin THEN aa.status::text ELSE ca.status::text END AS status,
        CASE WHEN u.is_admin THEN array_agg(DISTINCT r.name) ELSE ARRAY['customer'] END AS roles
      FROM
        u
      LEFT JOIN
        ${USER_SCHEMA}.${Admin.tableName} a ON a.admin_id = u.user_id
      LEFT JOIN
        ${USER_SCHEMA}.${AdminAccount.tableName} aa ON aa.admin_id = a.admin_id
      LEFT JOIN
        ${USER_SCHEMA}.${AdminRole.tableName} ar ON ar.admin_id = a.admin_id
      LEFT JOIN
        ${USER_SCHEMA}.${Role.tableName} r ON r.role_id = ar.role_id
      LEFT JOIN
        ${USER_SCHEMA}.${Customer.tableName} c ON c.customer_id = u.user_id
      LEFT JOIN
        ${USER_SCHEMA}.${CustomerAccount.tableName} ca ON ca.customer_id = c.customer_id
      LEFT JOIN
        ${USER_SCHEMA}.${CustomerPassword.tableName} cp ON cp.customer_id = c.customer_id
      GROUP BY
        u.is_admin, u.email, a.admin_id, c.customer_id, cp.password, aa.status, ca.status;`;

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
