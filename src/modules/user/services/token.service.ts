import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { QueryTypes, Transaction } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import { AdminRefreshToken, CustomerRefreshToken } from '@user/models';
import { JwtProviderType } from '@user/types';

const accessTokenService = {
  create: (
    email: string,
    provider: JwtProviderType,
    expiresIn: string | number,
  ) =>
    sign({ email, provider }, process.env.JWT_SECRET, {
      expiresIn,
    }),

  verify: (jwt: string) => {
    try {
      const decoded = verify(jwt, process.env.JWT_SECRET) as JwtPayload;

      if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000))
        throw ApiError.unauthorized('JWT Expired');

      return { email: decoded.email, provider: decoded.provider } as {
        email: string;
        provider: JwtProviderType;
        error: undefined;
      };
    } catch (e) {
      return { error: 'Invalid Access Token' };
    }
  },
};

const refreshTokenService = {
  create: async (
    isAdmin: boolean,
    userId: number,
    email: string,
    provider: JwtProviderType,
    transaction?: Transaction,
  ) => {
    const expiresIn = Date.now() + 7 * 24 * 60 * 60 * 1000;
    const expiresAt = new Date(expiresIn);
    const token = uuidv4();

    const { tokenId } = isAdmin
      ? await AdminRefreshToken.create(
          {
            adminId: userId,
            token,
            expiresAt,
          },
          { transaction },
        )
      : await CustomerRefreshToken.create(
          {
            customerId: userId,
            token,
            expiresAt,
          },
          { transaction },
        );

    const refreshToken = sign(
      { tokenId, token, email, provider },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn },
    );

    return refreshToken;
  },

  verify: async (refreshToken: string | undefined) => {
    const invalidError = { error: 'Invalid Refresh Token' };
    const expiredError = { error: 'Expired Refresh Token' };

    try {
      if (!refreshToken) return invalidError;

      const decoded = verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      ) as JwtPayload;

      if (!decoded.exp || decoded.exp < Math.floor(Date.now() / 1000))
        return expiredError;

      const { tokenId, token, email, provider } = decoded as {
        tokenId: number;
        token: string;
        email: string;
        provider: JwtProviderType;
      };

      const result = await refreshTokenService.get(email, tokenId);

      if (!result) return invalidError;

      const { isAdmin, token: hashed, status, expiresAt } = result;

      const isValid = isAdmin
        ? AdminRefreshToken.compareTokens(token, hashed)
        : CustomerRefreshToken.compareTokens(token, hashed);

      if (!isValid) return invalidError;
      if (expiresAt < new Date()) return expiredError;
      if (['disabled', 'suspended', 'deactivated'].includes(status))
        return { error: `Account ${status}` };

      return { ...result, provider, error: undefined };
    } catch (e) {
      return invalidError;
    }
  },

  get: async (email: string, tokenId: number) => {
    const query = `
      SELECT
        is_admin AS "isAdmin",
        user_id AS "userId",
        email,
        status,
        token_id AS "tokenId",
        token,
        expires_at AS "expiresAt"
      FROM users.get_refresh_token($email, $tokenId)`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { email, tokenId },
    })) as {
      isAdmin: boolean;
      userId: number;
      email: string;
      status: string;
      tokenId: number;
      token: string;
      expiresAt: Date;
    }[];

    return result.length === 0 ? null : result[0];
  },

  delete: async (
    isAdmin: boolean,
    tokenId: number,
    transaction?: Transaction,
  ) => {
    const result = isAdmin
      ? await AdminRefreshToken.destroy({
          where: { tokenId },
          transaction,
        })
      : await CustomerRefreshToken.destroy({
          where: { tokenId },
          transaction,
        });

    return result === 1;
  },
};

const tokenService = {
  generateAccessToken: (email: string, provider: JwtProviderType) =>
    accessTokenService.create(email, provider, '5m'),

  generateShortLivedAccessToken: (email: string, provider: JwtProviderType) =>
    accessTokenService.create(email, provider, '1m'),

  generateTokens: async (
    isAdmin: boolean,
    userId: number,
    email: string,
    provider: JwtProviderType,
  ) => {
    const accessToken = tokenService.generateAccessToken(email, provider);
    const refreshToken = await refreshTokenService.create(
      isAdmin,
      userId,
      email,
      provider,
    );

    return { accessToken, refreshToken };
  },

  verifyTokens: async (jwt: string, refreshToken: string) => {
    const access = accessTokenService.verify(jwt);
    const refresh = await refreshTokenService.verify(refreshToken);

    const isValid =
      refresh.error === undefined &&
      access.error === undefined &&
      refresh.email === access.email &&
      refresh.provider === access.provider;

    return isValid
      ? { isValid, email: access.email, provider: access.provider }
      : { isValid, error: refresh.error ?? access.error };
  },

  revokeRefreshToken: async (refreshToken: string | undefined) => {
    if (!refreshToken) return;

    const { tokenId, email } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    const retrievedToken = await refreshTokenService.get(email, tokenId);

    if (!retrievedToken) return;

    await refreshTokenService.delete(retrievedToken.isAdmin, tokenId);
  },

  rotateTokens: async (refreshToken: string | undefined) => {
    const result = await refreshTokenService.verify(refreshToken);

    if (result.error !== undefined) return result;

    const { isAdmin, userId, email, status, provider, tokenId } = result;

    if (['disabled', 'suspended', 'deactivated'].includes(status))
      return { error: `User account ${status}` };

    return sequelize.transaction(async (transaction) => {
      await refreshTokenService.delete(isAdmin, tokenId, transaction);

      const createdRefreshToken = await refreshTokenService.create(
        isAdmin,
        userId,
        email,
        provider,
        transaction,
      );

      const accessToken = tokenService.generateAccessToken(email, provider);

      return {
        refreshToken: createdRefreshToken,
        accessToken,
        error: undefined,
      };
    });
  },
};

export default tokenService;
