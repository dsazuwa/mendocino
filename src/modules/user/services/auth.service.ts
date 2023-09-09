import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { QueryTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import {
  Admin,
  AdminAccount,
  AdminOTP,
  AdminRefreshToken,
  Customer,
  CustomerEmail,
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
  email: string,
  provider: JwtProviderType,
) => {
  const token = uuidv4();
  const refreshToken = sign(
    { email, token, provider },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' },
  );
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const user = isAdmin
    ? await Admin.findByPk(userId, { raw: true })
    : await Customer.findByPk(userId, { raw: true });

  if (!user)
    throw ApiError.unauthorized(
      'Failed to create refresh token: Account does not exist',
    );

  const { status } = user;
  if (
    status === 'deactivated' ||
    status === 'disabled' ||
    status === 'suspended'
  )
    throw ApiError.unauthorized(
      `Failed to create refresh token: Account ${status}`,
    );

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

export const getRefreshToken = async (email: string, token: string) => {
  const query = `
    SELECT
      is_admin AS "isAdmin",
      user_id AS "userId",
      email,
      status,
      token,
      expires_at AS "expiresAt"
    FROM users.get_refresh_token($email, $token)`;

  const result = (await sequelize.query(query, {
    type: QueryTypes.SELECT,
    bind: { email, token },
  })) as {
    isAdmin: boolean;
    userId: number;
    email: string;
    status: string;
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
    const refreshToken = await generateRefreshToken(
      isAdmin,
      userId,
      email,
      provider,
    );

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
    if (!refreshToken) return { error: 'Invalid Refresh Token' };

    const decoded = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000))
      throw ApiError.unauthorized('JWT Expired');

    const { email, provider, token } = decoded;

    const result = await getRefreshToken(email, token);

    if (!result) return { error: 'Invalid Refresh Token' };

    if (result.expiresAt < new Date())
      return { error: 'Expired Refresh Token' };

    const { userId, status } = result;
    if (
      status === 'disabled' ||
      status === 'suspended' ||
      status === 'deactivated'
    )
      return { error: `Account ${status}` };

    return { userId, email, token, provider } as {
      userId: number;
      email: string;
      token: string;
      provider: JwtProviderType;
      error: null;
    };
  },

  verifyTokens: async (jwt: string, refreshToken: string) => {
    const accessT = authService.verifyJwt(jwt);
    const refreshT = await authService.verifyRefreshToken(refreshToken);

    return (
      refreshT.error === null &&
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

    const retrievedRefreshToken = await getRefreshToken(userId, token);

    if (!retrievedRefreshToken) return;

    if (retrievedRefreshToken.isAdmin)
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
        await Customer.update(
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
        { firstName, lastName, status: 'active' },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerEmail.create({ customerId, emailId }, { transaction });

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
        { firstName, lastName, status: 'pending' },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerEmail.create({ customerId, emailId }, { transaction });

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
        const admin = await Admin.findOne({
          where: { adminId: userId },
          transaction,
        });

        const account = await AdminAccount.findOne({
          where: { adminId: userId },
          transaction,
        });

        const isUser =
          admin !== null &&
          account !== null &&
          AdminAccount.comparePasswords(password, account.password);

        return isUser
          ? {
              isAdmin,
              userId,
              status: admin.status,
            }
          : null;
      }

      const customer = await Customer.findOne({
        where: { customerId: userId },
        raw: true,
        transaction,
      });

      const account = await CustomerEmail.findOne({
        where: { customerId: userId },
        raw: true,
        transaction,
      });

      const customerPassword = await CustomerPassword.findOne({
        where: { customerId: userId },
        transaction,
      });

      const isUser =
        customer !== null &&
        account !== null &&
        customerPassword !== null &&
        CustomerPassword.comparePasswords(password, customerPassword.password);

      return isUser
        ? {
            isAdmin,
            userId,
            status: customer.status,
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
    const result = await Customer.update(
      { status: 'active' },
      { where: { customerId, status: 'deactivated' } },
    );

    return result[0] === 1;
  },
};

export default authService;
