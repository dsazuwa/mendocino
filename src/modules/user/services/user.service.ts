/* eslint-disable @typescript-eslint/no-unused-vars */

import { Request } from 'express';
import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import { ProviderType } from '@user/models';
import { UserType } from '@user/types';
import messages from '@user/utils/messages';

const userService = {
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

  getUserWithoutId: async (userId: number, isAdmin: boolean) => {
    const result = await userService.getUserById(userId, isAdmin);

    if (!result) throw ApiError.notFound(messages.USER_NOT_FOUND);

    const { userId: id, ...user } = result;

    return user;
  },

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
      SELECT
        is_admin AS "isAdmin",
        has_password AS "hasPassword",
        user_id AS "userId",
        status
      FROM users.get_user_for_recovery($email)`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { email },
    });

    return result.length === 0
      ? undefined
      : (result[0] as {
          isAdmin: boolean;
          hasPassword: boolean;
          userId: number;
          status: string;
        });
  },
};

export default userService;
