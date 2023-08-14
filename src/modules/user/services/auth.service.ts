import { sign } from 'jsonwebtoken';
import { Op, QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import {
  AuthOTP,
  AuthOTPType,
  ProviderType,
  Role,
  User,
  UserAccount,
  UserIdentity,
  UserRole,
} from '@user/models';
import { roleConstants } from '@user/utils/constants';

type JWTProviderType = ProviderType | 'email';

export const createUserIdentityForUser = (
  identityId: string,
  userId: number,
  status: string,
  provider: ProviderType,
) =>
  sequelize.transaction(async (transaction) => {
    if (status === 'pending') {
      await UserAccount.update(
        { status: 'active' },
        { where: { userId }, transaction },
      );
    }

    const identity = await UserIdentity.create(
      { identityId, userId, provider },
      { transaction },
    );

    return identity;
  });

export const createUserAndUserIdentity = (
  identityId: string,
  firstName: string,
  lastName: string,
  email: string,
  provider: ProviderType,
) =>
  sequelize.transaction(async (transaction) => {
    const { userId } = await User.create(
      { firstName, lastName },
      { transaction },
    );

    await UserAccount.create(
      { userId, email, status: 'active' },
      { transaction },
    );

    const identity = await UserIdentity.create(
      { identityId, userId, provider },
      { transaction },
    );

    await UserRole.create(
      { userId, roleId: roleConstants.CUSTOMER },
      { transaction },
    );

    return identity;
  });

const authService = {
  generateJWT: (userId: number, provider: JWTProviderType) =>
    sign({ userId, provider }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    }),

  getUserData: async (userId: number, provider: JWTProviderType) => {
    const isEmailAuth = provider === 'email';

    const statusField = isEmailAuth ? 'a.status' : "'active'";

    const identityJoin = isEmailAuth
      ? ''
      : `JOIN ${UserIdentity.tableName} i 
            ON u.user_id = i.user_id AND i.provider = '${provider}'`;

    const statusGroupBy = isEmailAuth ? 'a.status,' : '';

    const query = `
      SELECT
        u.user_id AS "userId",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        a.email AS email,
        ${statusField} AS status,
        array_agg(r.name) AS roles
      FROM
        ${User.tableName} u
      JOIN
        ${UserAccount.tableName} a ON u.user_id = a.user_id
      ${identityJoin}
      JOIN
        ${UserRole.tableName} ur ON u.user_id = ur.user_id
      JOIN
        ${Role.tableName} r ON r.role_id = ur.role_id
      WHERE
        u.user_id = ${userId}
      GROUP BY
        u.user_id, u.first_name, u.last_name,${statusGroupBy} a.email;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? undefined : (result[0] as Express.User);
  },

  getUserDataFromIdentity: async (
    identityId: string,
    provider: ProviderType,
  ) => {
    const query = `
      SELECT
        u.user_id AS "userId",
        u.first_name AS "firstName",
        u.last_name AS "lastName",
        a.email AS email,
        'active' AS status,
        array_agg(r.name) AS roles
      FROM
        ${User.tableName} u
      JOIN
        ${UserAccount.tableName} a ON u.user_id = a.user_id
      JOIN 
        ${UserIdentity.tableName} i ON u.user_id = i.user_id AND i.provider = '${provider}'
      JOIN
        ${UserRole.tableName} ur ON u.user_id = ur.user_id
      JOIN
        ${Role.tableName} r ON r.role_id = ur.role_id
      WHERE
        i.identity_id = '${identityId}' AND u.user_id = i.user_id
      GROUP BY
        u.user_id, u.first_name, u.last_name, a.email;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? undefined : (result[0] as Express.User);
  },

  getAccount: (email: string) => UserAccount.findOne({ where: { email } }),

  getIdentity: (identityId: string, provider: ProviderType) =>
    UserIdentity.findOne({
      where: { identityId, provider },
    }),

  getAuthOTP: async (userId: number, password: string, type: AuthOTPType) => {
    const authOTP = await AuthOTP.findOne({
      where: { userId, type },
    });

    const isValid =
      authOTP !== null &&
      authOTP.comparePasswords(password) &&
      authOTP.expiresAt > new Date();

    return isValid ? { authOTP, isValid } : { authOTP: null, isValid };
  },

  createAuthOTP: async (userId: number, type: AuthOTPType) =>
    sequelize.transaction(async (transaction) => {
      await AuthOTP.destroy({
        where: { userId, type },
        transaction,
      });

      const password = '12345';

      await AuthOTP.create(
        {
          userId,
          type,
          password,
          expiresAt: AuthOTP.getExpiration(),
        },
        { transaction },
      );

      return password;
    }),

  createNewIdentity: (
    identityId: string,
    account: UserAccount | null,
    firstName: string,
    lastName: string,
    email: string,
    provider: ProviderType,
  ) =>
    account
      ? createUserIdentityForUser(
          identityId,
          account.userId,
          account.status,
          provider,
        )
      : createUserAndUserIdentity(
          identityId,
          firstName,
          lastName,
          email,
          provider,
        ),

  createUser: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) =>
    sequelize.transaction(async (transaction) => {
      const user = await User.create({ firstName, lastName }, { transaction });

      const account = await UserAccount.create(
        { userId: user.userId, email, password },
        { transaction },
      );

      await AuthOTP.destroy({
        where: { userId: user.userId, type: 'verify' },
        transaction,
      });

      const otp = '12345';

      await AuthOTP.create(
        {
          userId: user.userId,
          type: 'verify',
          password: otp,
          expiresAt: AuthOTP.getExpiration(),
        },
        { transaction },
      );

      await UserRole.create(
        { userId: user.userId, roleId: roleConstants.CUSTOMER },
        { transaction },
      );

      return { user, account, password: otp };
    }),

  loginUser: async (email: string, password: string) => {
    const account = await UserAccount.findOne({
      where: {
        email,
        password: { [Op.ne]: null },
      },
    });

    const isUser = account !== null && account.comparePasswords(password);

    return isUser ? { account, isUser } : { account: null, isUser };
  },

  recoverPassword: (userId: number, password: string) =>
    sequelize.transaction(async (transaction) => {
      await AuthOTP.destroy({
        where: { userId, type: 'recover' },
        transaction,
      });

      await UserAccount.update(
        { password },
        {
          where: { userId },
          individualHooks: true,
          transaction,
        },
      );
    }),

  reactivate: (userId: number) =>
    UserAccount.update({ status: 'active' }, { where: { userId } }),
};

export default authService;
