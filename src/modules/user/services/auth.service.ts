import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import {
  AdminAccount,
  AdminOTP,
  AdminRefreshToken,
  Customer,
  CustomerAccount,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  CustomerRefreshToken,
  Email,
  ProviderType,
} from '@user/models';
import { JwtProviderType } from '@user/types';
import userService from './user.service';

const generateJwt = (email: string, provider: JwtProviderType) =>
  sign({ email, provider }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

const generateRefreshToken = async (
  isAdmin: boolean,
  userId: number,
  provider: JwtProviderType,
) => {
  const token = uuidv4();
  const refreshToken = sign(
    { userId, token, provider },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  );
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  if (isAdmin)
    await AdminRefreshToken.create({
      adminId: userId,
      token,
      expiresAt,
    });
  else
    await CustomerRefreshToken.create({
      customerId: userId,
      token,
      expiresAt,
    });

  return refreshToken;
};

export const getRefreshToken = async (userId: number, token: string) => {
  const query = `
    SELECT
      is_admin AS "isAdmin",
      user_id AS "userId",
      email,
      token,
      expires_at AS "expiresAt"
    FROM users.get_refresh_token($userId, $token)`;

  const result = (await sequelize.query(query, {
    type: QueryTypes.SELECT,
    bind: { userId, token },
  })) as {
    isAdmin: boolean;
    userId: number;
    email: string;
    token: string;
    expiresAt: Date;
  }[];

  return result.length === 0 ? null : result[0];
};

const authService = {
  generateJwt,

  generateRefreshToken,

  generateTokens: async (
    isAdmin: boolean,
    userId: number,
    email: string,
    provider: JwtProviderType,
  ) => {
    const jwt = generateJwt(email, provider);
    const refreshToken = await generateRefreshToken(isAdmin, userId, provider);

    return { jwt, refreshToken };
  },

  verifyJwt: (jwt: string) => {
    const decoded = verify(jwt, process.env.JWT_SECRET) as JwtPayload;

    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000))
      throw ApiError.unauthorized('JWT Expired');

    return { email: decoded.email, provider: decoded.provider } as {
      email: string;
      provider: JwtProviderType;
    };
  },

  verifyRefreshToken: async (refreshToken: string | undefined) => {
    if (!refreshToken) return null;

    const decoded = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000))
      throw ApiError.unauthorized('JWT Expired');

    const { userId, token, provider } = decoded;

    const result = await getRefreshToken(userId, token);

    if (!result || result.expiresAt < new Date()) return null;

    return { userId, email: result.email, token, provider } as {
      userId: number;
      email: string;
      token: string;
      provider: JwtProviderType;
    };
  },

  verifyTokens: async (jwt: string, refreshToken: string) => {
    const accessT = authService.verifyJwt(jwt);
    const refreshT = await authService.verifyRefreshToken(refreshToken);

    return !!(
      refreshT &&
      refreshT.email === accessT.email &&
      refreshT.provider === accessT.provider
    );
  },

  revokeRefreshToken: async (refreshToken: string | undefined) => {
    if (!refreshToken) return;

    const { userId, token } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    const result = await getRefreshToken(userId, token);

    if (!result) return;
    if (result.isAdmin)
      await AdminRefreshToken.destroy({ where: { adminId: userId, token } });
    else
      await CustomerRefreshToken.destroy({
        where: { customerId: userId, token },
      });
  },

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
      const result = await userService.getUserIdForUser(email, transaction);

      if (!result) return null;

      const { isAdmin, userId } = result;

      if (isAdmin) {
        const account = await AdminAccount.findOne({
          where: { adminId: userId },
          transaction,
        });

        const isUser = account !== null && account.comparePasswords(password);

        return isUser
          ? {
              isAdmin,
              userId,
              status: account.status,
            }
          : null;
      }

      const account = await CustomerAccount.findOne({
        where: { customerId: userId },
        raw: true,
        transaction,
      });

      const customerPassword = await CustomerPassword.findOne({
        where: { customerId: userId },
        transaction,
      });

      const isUser =
        account !== null &&
        customerPassword !== null &&
        customerPassword.comparePasswords(password);

      return isUser
        ? {
            isAdmin,
            userId,
            status: account.status,
          }
        : null;
    }),

  recoverPassword: (isAdmin: boolean, userId: number, password: string) =>
    isAdmin
      ? sequelize.transaction(async (transaction) => {
          await AdminOTP.destroy({
            where: { adminId: userId, type: 'password' },
            transaction,
          });

          const result = await AdminAccount.update(
            { password },
            {
              where: { adminId: userId },
              individualHooks: true,
              transaction,
            },
          );

          return result[0] === 1;
        })
      : sequelize.transaction(async (transaction) => {
          await CustomerOTP.destroy({
            where: { customerId: userId, type: 'password' },
            transaction,
          });

          const result = await CustomerPassword.update(
            { password },
            {
              where: { customerId: userId },
              individualHooks: true,
              transaction,
            },
          );

          return result[0] === 1;
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
