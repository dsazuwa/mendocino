import { JwtPayload, verify } from 'jsonwebtoken';

import {
  Admin,
  AdminRefreshToken,
  Customer,
  CustomerRefreshToken,
  Email,
} from '@user/models';
import tokenService from '@user/services/token.service';
import { ROLES } from '@user/utils/constants';

import {
  createAdmin,
  createCustomer,
  createRoles,
} from 'tests/modules/user/helper-functions';

import 'tests/db-setup';

beforeAll(async () => {
  await createRoles();
});

describe('generate access token', () => {
  const email = 'janicedoe@gmail.com';

  it('should generate a token for email', async () => {
    const provider = 'email';

    let token = tokenService.generateAccessToken(email, provider);
    let decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);

    token = tokenService.generateShortLivedAccessToken(email, provider);
    decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);
  });

  it('should generate a token for google', async () => {
    const provider = 'google';

    let token = tokenService.generateAccessToken(email, provider);
    let decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);

    token = tokenService.generateShortLivedAccessToken(email, provider);
    decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);
  });

  it('should generate a token for facebook', async () => {
    const provider = 'facebook';

    let token = tokenService.generateAccessToken(email, provider);
    let decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);

    token = tokenService.generateShortLivedAccessToken(email, provider);
    decoded = verify(token, process.env.JWT_SECRET) as JwtPayload;

    expect(decoded.email).toBe(email);
    expect(decoded.provider).toBe(provider);
  });
});

describe('generate tokens', () => {
  it('should generate tokens for admin', async () => {
    const email = 'joedoe@gmail.com';
    const provider = 'email';

    const { adminId } = await createAdmin(
      'Joe',
      'Doe',
      email,
      'joeDoePa$$',
      'active',
      [ROLES.CUSTOMER_SUPPORT.roleId],
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      true,
      adminId,
      email,
      provider,
    );

    const decodedAccessToken = verify(
      accessToken,
      process.env.JWT_SECRET,
    ) as JwtPayload;
    expect(decodedAccessToken.email).toBe(email);
    expect(decodedAccessToken.provider).toBe(provider);

    const {
      tokenId,
      token,
      email: tEmail,
      provider: tProvider,
    } = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtPayload;

    expect(tEmail).toBe(email);
    expect(tProvider).toBe(provider);

    const retrievedToken = await AdminRefreshToken.findOne({
      where: { tokenId, adminId },
      raw: true,
    });

    expect(retrievedToken).not.toBeNull();
    expect(
      AdminRefreshToken.compareTokens(token, retrievedToken?.token || ''),
    ).toBe(true);
  });

  it('should generate tokens for customer', async () => {
    const email = 'jadoe@gmail.com';
    const provider = 'email';

    const { customerId } = await createCustomer(
      'Ja',
      'Doe',
      email,
      'jaDoePa$$',
      'active',
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      customerId,
      email,
      provider,
    );

    const decodedAccessToken = verify(
      accessToken,
      process.env.JWT_SECRET,
    ) as JwtPayload;
    expect(decodedAccessToken.email).toBe(email);
    expect(decodedAccessToken.provider).toBe(provider);

    const {
      tokenId,
      token,
      email: tEmail,
      provider: tProvider,
    } = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET) as JwtPayload;

    expect(tEmail).toBe(email);
    expect(tProvider).toBe(provider);

    const retrievedToken = await CustomerRefreshToken.findOne({
      where: { tokenId, customerId },
      raw: true,
    });

    expect(retrievedToken).not.toBeNull();
    expect(
      CustomerRefreshToken.compareTokens(token, retrievedToken?.token || ''),
    ).toBe(true);
  });
});

describe('verify tokens', () => {
  beforeEach(async () => {
    await Admin.destroy({ where: {} });
    await Customer.destroy({ where: {} });
    await Email.destroy({ where: {} });
  });

  it('should successfully verify tokens for active/pending admin', async () => {
    const email = 'jasminedoe@gmail.com';
    const provider = 'email';

    const { adminId } = await createAdmin(
      'Jasmine',
      'Doe',
      email,
      'JassD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      true,
      adminId,
      email,
      provider,
    );

    let result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(true);
    expect(result.email).toBe(email);
    expect(result.provider).toBe(provider);

    await Admin.update({ status: 'pending' }, { where: { adminId } });

    result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(true);
    expect(result.email).toBe(email);
    expect(result.provider).toBe(provider);
  });

  it('should fail on disabled admin', async () => {
    const email = 'jasminedoe@gmail.com';
    const provider = 'email';

    const { adminId } = await createAdmin(
      'Jasmine',
      'Doe',
      email,
      'JassD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      true,
      adminId,
      email,
      provider,
    );

    await Admin.update({ status: 'disabled' }, { where: { adminId } });

    const result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(false);
    expect(result.email).not.toBeDefined();
    expect(result.provider).not.toBeDefined();
  });

  it('should fail on different user access-token and refresh-token', async () => {
    const provider = 'email';

    const email1 = 'jasminedoe@gmail.com';
    const { adminId: id1 } = await createAdmin(
      'Jasmine',
      'Doe',
      email1,
      'JassD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );

    const email2 = 'jazzdoe@gmail.com';
    const { adminId: id2 } = await createAdmin(
      'Jazz',
      'Doe',
      email2,
      'JassD0ePa$$',
      'active',
      [ROLES.DELIVERY_DRIVER.roleId],
    );

    const { accessToken } = await tokenService.generateTokens(
      true,
      id1,
      email1,
      provider,
    );

    const { refreshToken } = await tokenService.generateTokens(
      true,
      id2,
      email2,
      provider,
    );

    const result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(false);
    expect(result.email).not.toBeDefined();
    expect(result.provider).not.toBeDefined();
  });

  it('should successfully verify tokens for active/pending customer', async () => {
    const email = 'jasminedoe@gmail.com';
    const provider = 'email';

    const { customerId } = await createCustomer(
      'Jasmine',
      'Doe',
      email,
      'JassD0ePa$$',
      'active',
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      customerId,
      email,
      provider,
    );

    let result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(true);
    expect(result.email).toBe(email);
    expect(result.provider).toBe(provider);

    await Customer.update({ status: 'pending' }, { where: { customerId } });

    result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(true);
    expect(result.email).toBe(email);
    expect(result.provider).toBe(provider);
  });

  it('should fail on suspended/deactivated customer', async () => {
    const email = 'jasminedoe@gmail.com';
    const provider = 'email';

    const { customerId } = await createCustomer(
      'Jasmine',
      'Doe',
      email,
      'JassD0ePa$$',
      'active',
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      customerId,
      email,
      provider,
    );

    await Customer.update({ status: 'suspended' }, { where: { customerId } });

    let result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Account suspended');
    expect(result.email).not.toBeDefined();
    expect(result.provider).not.toBeDefined();

    await Customer.update({ status: 'deactivated' }, { where: { customerId } });

    result = await tokenService.verifyTokens(accessToken, refreshToken);
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Account deactivated');
    expect(result.email).not.toBeDefined();
    expect(result.provider).not.toBeDefined();
  });
});

describe('revoke refresh token', () => {
  beforeEach(async () => {
    await Customer.destroy({ where: {} });
    await Admin.destroy({ where: {} });
    await Email.destroy({ where: {} });
  });

  it('should revoke admin refresh token', async () => {
    const email = 'johndoe@gmail.com';

    const { adminId } = await createAdmin(
      'John',
      'Doe',
      email,
      'johnD0ePa$$',
      'active',
      [ROLES.ROOT.roleId],
    );

    const { refreshToken } = await tokenService.generateTokens(
      true,
      adminId,
      email,
      'email',
    );

    const { tokenId } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    let token = await AdminRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    await tokenService.revokeRefreshToken(refreshToken);

    token = await AdminRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).toBeNull();
  });

  it('should revoke customer refresh token', async () => {
    const email = 'johndoe@gmail.com';

    const { customerId } = await createCustomer(
      'John',
      'Doe',
      email,
      'johnD0ePa$$',
      'active',
    );

    const { refreshToken } = await tokenService.generateTokens(
      false,
      customerId,
      email,
      'email',
    );

    const { tokenId } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    let token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    await tokenService.revokeRefreshToken(refreshToken);

    token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).toBeNull();
  });
});

describe('rotate tokens', () => {
  beforeEach(async () => {
    await Customer.destroy({ where: {} });
    await Admin.destroy({ where: {} });
    await Email.destroy({ where: {} });
  });

  it('should successfully rotate tokens for active/pending admin', async () => {
    const email = 'janedoe@gmail.com';

    const { adminId } = await createAdmin(
      'Jane',
      'Doe',
      email,
      'janeD0ePa$$',
      'active',
      [ROLES.ROOT.roleId],
    );

    const tokens = await tokenService.generateTokens(
      true,
      adminId,
      email,
      'email',
    );
    const { refreshToken } = tokens;

    const { tokenId } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    let token = await AdminRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    const result = await tokenService.rotateTokens(refreshToken);

    if (result.error === undefined) {
      const newRefreshToken = result.refreshToken;

      token = await AdminRefreshToken.findByPk(tokenId, { raw: true });
      expect(token).toBeNull();

      const { tokenId: newTokenId } = verify(
        newRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      ) as JwtPayload;

      token = await AdminRefreshToken.findByPk(newTokenId, { raw: true });
      expect(token).not.toBeNull();
    } else {
      expect(true).toBe(false);
    }
  });

  it('should fail to rotate tokens for disabled admin', async () => {
    const email = 'janedoe@gmail.com';

    const { adminId } = await createAdmin(
      'Jane',
      'Doe',
      email,
      'janeD0ePa$$',
      'active',
      [ROLES.ROOT.roleId],
    );

    const tokens = await tokenService.generateTokens(
      true,
      adminId,
      email,
      'email',
    );
    const { refreshToken } = tokens;

    const { tokenId } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    let token = await AdminRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    await Admin.update({ status: 'disabled' }, { where: { adminId } });

    const result = await tokenService.rotateTokens(refreshToken);
    expect(result.error).toBeDefined();

    token = await AdminRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();
  });

  it('should successfully rotate tokens for active/pending customer', async () => {
    const email = 'janedoe@gmail.com';

    const { customerId } = await createCustomer(
      'Jane',
      'Doe',
      email,
      'janeD0ePa$$',
      'active',
    );

    const tokens = await tokenService.generateTokens(
      false,
      customerId,
      email,
      'email',
    );
    const { refreshToken } = tokens;

    const { tokenId } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    let token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    const result = await tokenService.rotateTokens(refreshToken);

    if (result.error === undefined) {
      const newRefreshToken = result.refreshToken;

      token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
      expect(token).toBeNull();

      const { tokenId: newTokenId } = verify(
        newRefreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      ) as JwtPayload;

      token = await CustomerRefreshToken.findByPk(newTokenId, { raw: true });
      expect(token).not.toBeNull();
    } else {
      expect(true).toBe(false);
    }
  });

  it('should fail to rotate tokens for suspended/deactivated customer', async () => {
    const email = 'janedoe@gmail.com';

    const { customerId } = await createCustomer(
      'Jane',
      'Doe',
      email,
      'janeD0ePa$$',
      'active',
    );

    const tokens = await tokenService.generateTokens(
      false,
      customerId,
      email,
      'email',
    );
    const { refreshToken } = tokens;

    const { tokenId } = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    ) as JwtPayload;

    let token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    await Customer.update({ status: 'suspended' }, { where: { customerId } });

    let result = await tokenService.rotateTokens(refreshToken);
    expect(result.error).toBeDefined();

    token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();

    await Customer.update({ status: 'deactivated' }, { where: { customerId } });

    result = await tokenService.rotateTokens(refreshToken);
    expect(result.error).toBeDefined();

    token = await CustomerRefreshToken.findByPk(tokenId, { raw: true });
    expect(token).not.toBeNull();
  });
});
