import { Request } from 'express';
import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import {
  Admin,
  AdminAccount,
  AdminRole,
  Customer,
  CustomerEmail,
  CustomerPassword,
  ProviderType,
  Role,
} from '@user/models';
import { UserType } from '@user/types';
import { USER_SCHEMA, VIEWS } from '@user/utils/constants';

const userService = {
  getUserByEmail: async (email: string) => {
    const query = `
      SELECT
        is_admin AS "isAdmin",
        user_id AS "userId",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        status,
        roles
      FROM users.get_user_by_email($email);`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { email },
    });

    return result.length === 0
      ? null
      : (result[0] as UserType & { isAdmin: boolean });
  },

  getUserById: async (userId: number, isAdmin: boolean) => {
    const table = isAdmin
      ? 'users.get_admin($userId)'
      : 'users.get_customer($userId)';

    const query = `
      SELECT
        user_id AS "userId",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        status,
        roles
      FROM ${table}`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { userId },
    });

    return result.length === 0 ? undefined : (result[0] as UserType);
  },

  getUserFromReq: async (req: Request) => {
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

    return result.length === 0 ? undefined : (result[0] as UserType);
  },

  getUserForSocialAuthentication: async (
    identityId: string,
    provider: ProviderType,
    email: string,
  ) => {
    const query = `
      SELECT
        is_Admin AS "isAdmin",
        identity_exists AS "identityExists",
        user_id AS "userId",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        status,
        roles
      FROM users.get_user_for_social_authentication($email, $identityId, $provider);`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { email, identityId, provider },
    });

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

    const { isAdmin, identityExists, ...user } = result[0] as UserType & {
      isAdmin: boolean;
      identityExists: boolean;
    };

    return {
      isAdmin,
      identityExists,
      user: isAdmin ? null : user,
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
        CASE WHEN u.is_admin THEN a.status::text ELSE c.status::text END AS status,
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
        ${USER_SCHEMA}.${CustomerEmail.tableName} ca ON ca.customer_id = c.customer_id
      LEFT JOIN
        ${USER_SCHEMA}.${CustomerPassword.tableName} cp ON cp.customer_id = c.customer_id
      GROUP BY
        u.is_admin, u.email, a.admin_id, c.customer_id, cp.password, a.status, c.status;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0
      ? undefined
      : (result[0] as UserType & { isAdmin: boolean; hasPassword: boolean });
  },
};

export default userService;
