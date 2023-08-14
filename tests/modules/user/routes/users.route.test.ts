import { JwtPayload, verify } from 'jsonwebtoken';

import { AuthOTP, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';
import { roleConstants } from '@user/utils/constants';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';
import { getTokenFrom, request } from 'tests/supertest.helper';

import 'tests/modules/user/user.mock.db';

const BASE_URL = '/api/users';

describe('Users Routes', () => {
  describe(`GET ${BASE_URL}/me`, () => {
    it('return data for pending user', async () => {
      const firstName = 'Joyce';
      const lastName = 'Doe';
      const email = 'joycedoe@gmail.com';
      const password = 'joyceD0epa$$';
      const status = 'pending';

      const { userId } = await createUserAccount(
        firstName,
        lastName,
        email,
        password,
        status,
        [roleConstants.CUSTOMER.roleId],
      );

      const jwt = authService.generateJWT(userId, 'email');

      const response = await request
        .get(`${BASE_URL}/me`)
        .auth(jwt, { type: 'bearer' });

      expect(response.status).toBe(200);

      const { user } = response.body;
      expect(user).toMatchObject({ firstName, lastName, email, status });
    });
  });

  describe(`POST ${BASE_URL}/me/verify`, () => {
    let userId: number;
    let jwt: string;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'Jaz',
        'Doe',
        'jazdoe@gmail.com',
        'jazD0ePa$$',
        'pending',
        [roleConstants.CUSTOMER.roleId],
      );

      userId = user.userId;
      jwt = authService.generateJWT(userId, 'email');
    });

    it('should create a new verification token', async () => {
      let otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      expect(otp).toBeNull();

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(jwt, { type: 'bearer' })
        .expect(200);

      otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      expect(otp).not.toBeNull();
    });

    it('should destroy previous verification token', async () => {
      const otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      const { otpId } = otp as AuthOTP;

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(jwt, { type: 'bearer' })
        .expect(200);

      const otps = await AuthOTP.findAll({ where: { userId, type: 'verify' } });
      expect(otps.length).toBe(1);

      const [newOTP] = otps;
      expect(newOTP).not.toBeNull();
      expect(newOTP?.otpId).not.toBe(otpId);
    });

    it('should fail for active user', async () => {
      const { user } = await createUserAccount(
        'Jeff',
        'Doe',
        'jeffdoe@gmail.com',
        null,
        'active',
        [roleConstants.CUSTOMER.roleId],
      );

      const token = authService.generateJWT(user.userId, 'email');

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(token, { type: 'bearer' })
        .expect(401);
    });
  });

  describe(`PATCH ${BASE_URL}/me/verify/:otp`, () => {
    const mockOTP = '123456';

    let userId: number;
    let jwt: string;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'Jax',
        'Doe',
        'jaxdoe@gmail.com',
        'jaxD0ePa$$',
        'pending',
        [roleConstants.CUSTOMER.roleId],
      );
      userId = user.userId;
      jwt = authService.generateJWT(userId, 'email');
    });

    it('should fail for active user', async () => {
      const { user } = await createUserAccount(
        'Jess',
        'Doe',
        'jessdoe@gmail.com',
        'jessD0ePa$$',
        'active',
        [roleConstants.CUSTOMER.roleId],
      );

      const token = authService.generateJWT(user.userId, 'email');

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(token, { type: 'bearer' })
        .expect(401);
    });

    it('should fail on wrong otp', async () => {
      await request
        .patch(`${BASE_URL}/me/verify/111111`)
        .auth(jwt, { type: 'bearer' })
        .expect(401);
    });

    it('should fail on non-numeric otp', async () => {
      await request
        .patch(`${BASE_URL}/me/verify/nonnumeric`)
        .auth(jwt, { type: 'bearer' })
        .expect(400);
    });

    it('should fail on expired otp', async () => {
      await AuthOTP.destroy({ where: { userId, type: 'verify' } });

      await AuthOTP.create({
        userId,
        type: 'verify',
        password: mockOTP,
        expiresAt: new Date(),
      });

      await request
        .patch(`${BASE_URL}/me/verify/${mockOTP}`)
        .auth(jwt, { type: 'bearer' })
        .expect(401);
    });

    it('should verify user', async () => {
      await AuthOTP.destroy({ where: { userId, type: 'verify' } });

      await AuthOTP.create({
        userId,
        type: 'verify',
        password: mockOTP,
        expiresAt: AuthOTP.getExpiration(),
      });

      await request
        .patch(`${BASE_URL}/me/verify/${mockOTP}`)
        .auth(jwt, { type: 'bearer' })
        .expect(200);

      const retrievedAcct = await UserAccount.findByPk(userId);
      expect(retrievedAcct?.status).toEqual('active');
    });
  });

  describe(`POST ${BASE_URL}/me/password`, () => {
    it('should create password for account with null password', async () => {
      const { userId, account } = await createUserAccount(
        'Jamie',
        'Doe',
        'jamiedoe@gmail.com',
        null,
        'active',
        [roleConstants.CUSTOMER.roleId],
      );

      const jwt = authService.generateJWT(userId, 'email');
      const password = 'jaimeD0ePa$$';

      expect(account?.comparePasswords(password)).toBe(false);

      await request
        .post(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ password })
        .expect(200);

      const a = await UserAccount.findByPk(userId);
      expect(a?.comparePasswords(password)).toBe(true);
    });

    it('should fail to create password for account with non-null password', async () => {
      const { userId, account } = await createUserAccount(
        'Julien',
        'Doe',
        'juliendoe@gmail.com',
        'julienD0ePa$$',
        'active',
        [roleConstants.CUSTOMER.roleId],
      );

      const jwt = authService.generateJWT(userId, 'email');
      const password = 'newJulienD0ePa$$';

      expect(account?.comparePasswords(password)).toBe(false);

      await request
        .post(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ password })
        .expect(409);

      const a = await UserAccount.findByPk(userId);
      expect(a?.comparePasswords(password)).toBe(false);
    });
  });

  describe(`PATCH ${BASE_URL}/me/password`, () => {
    const password = 'jeanD0ePa$$';

    let userId: number;
    let jwt: string;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'Jeanette',
        'Doe',
        'jeanettedoe@gmail.com',
        password,
        'active',
        [roleConstants.CUSTOMER.roleId],
      );

      userId = user.userId;
      jwt = authService.generateJWT(userId, 'email');
    });

    it('should update password', async () => {
      const newPassword = 'newjeanD0ePa$$';

      await request
        .patch(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ currentPassword: password, newPassword })
        .expect(200);

      const a = await UserAccount.findByPk(userId);
      expect(a?.comparePasswords(newPassword)).toBe(true);
    });

    it('should fail to update password on invalid new password', async () => {
      const newPassword = 'newjeanD0ePa$$2';

      await request
        .patch(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({
          currentPassword: 'wrongCurrentPassword',
          password: newPassword,
        })
        .expect(400);

      await request
        .patch(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ currentPassword: password, password: 'invalidPassword' })
        .expect(400);

      await request
        .patch(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .expect(400);
    });

    it('should fail if current and new password are the same', async () => {
      const newPassword = 'D0ePa$$w0rd';

      await request
        .patch(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ currentPassword: password, password: newPassword })
        .expect(400);
    });
  });

  describe(`PATCH ${BASE_URL}/me/revoke-social-auth`, () => {
    it('should delete identity and swtich to email login if user has an account with a password', async () => {
      const provider = 'google';

      const { userId, account } = await createUserAccountAndIdentity(
        'Jennifer',
        'Doe',
        'jenniferdoe@gmail.com',
        'jenniferD0ePa$$',
        'active',
        [{ identityId: '3654755345356474363', provider }],
        [roleConstants.CUSTOMER.roleId],
      );

      expect(account.password).not.toBeNull();

      const jwt = authService.generateJWT(userId, provider);

      const response = await request
        .patch(`${BASE_URL}/me/revoke-social-auth`)
        .send({ provider })
        .auth(jwt, { type: 'bearer' });

      expect(response.status).toBe(200);

      const accessToken = getTokenFrom(response.headers['set-cookie']);
      expect(accessToken).not.toEqual('');

      const decoded = verify(accessToken, process.env.JWT_SECRET) as JwtPayload;
      expect(decoded.userId).toBe(userId);
      expect(decoded.provider).toBe('email');
    });

    it('should delete identity if user has no account with a password, but has some other identity', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'Jack',
        'Doe',
        'jackdoe@gmail.com',
        null,
        'active',
        [
          { identityId: '687453534367486564', provider: 'google' },
          { identityId: '234267589676438787', provider: 'facebook' },
        ],
        [roleConstants.CUSTOMER.roleId],
      );

      expect(account.password).toBeNull();

      const jwt = authService.generateJWT(userId, 'google');

      const response = await request
        .patch(`${BASE_URL}/me/revoke-social-auth`)
        .send({ provider: 'google' })
        .auth(jwt, { type: 'bearer' });

      expect(response.status).toBe(200);

      const accessToken = getTokenFrom(response.headers['set-cookie']);
      expect(accessToken).not.toEqual('');

      const decoded = verify(accessToken, process.env.JWT_SECRET) as JwtPayload;
      expect(decoded.userId).toBe(userId);
      expect(decoded.provider).toBe('facebook');

      let i = await UserIdentity.findOne({
        where: { userId, provider: 'google' },
      });
      expect(i).toBeNull();

      i = await UserIdentity.findOne({
        where: { userId, provider: 'facebook' },
      });
      expect(i).not.toBeNull();
    });

    it('should delete user if user has neither an account with a password, nor some other identity', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'Jas',
        'Doe',
        'jasdoe@gmail.com',
        null,
        'active',
        [{ identityId: '7934872657237824972478', provider: 'google' }],
        [roleConstants.CUSTOMER.roleId],
      );

      expect(account.password).toBeNull();

      const jwt = authService.generateJWT(userId, 'google');

      const response = await request
        .patch(`${BASE_URL}/me/revoke-social-auth`)
        .send({ provider: 'google' })
        .auth(jwt, { type: 'bearer' });

      expect(response.status).toBe(200);

      const accessToken = getTokenFrom(response.headers['set-cookie']);
      expect(accessToken).toEqual('');

      const u = await User.findByPk(userId);
      expect(u).toBe(null);
    });
  });

  describe(`PATCH ${BASE_URL}/me/close`, () => {
    it('should set account status to inactive if user account has a password', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'James',
        'Doe',
        'jamesdoe@gmail.com',
        'JamesD0ePa$$',
        'active',
        [{ identityId: '493285792423287429704372084', provider: 'google' }],
        [roleConstants.CUSTOMER.roleId],
      );

      expect(account.password).not.toBeNull();

      const jwt = authService.generateJWT(userId, 'google');

      const response = await request
        .patch(`${BASE_URL}/me/close`)
        .send({ provider: 'google' })
        .auth(jwt, { type: 'bearer' });

      expect(response.status).toBe(200);

      const u = await User.findByPk(userId);
      expect(u).not.toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).not.toBeNull();
      expect(a?.status).toBe('inactive');

      const identities = await UserIdentity.findAll({ where: { userId } });
      expect(identities.length).toBe(0);
    });

    it('should delete user if account does not have a password', async () => {
      const { userId, account } = await createUserAccountAndIdentity(
        'Jairo',
        'Doe',
        'jairodoe@gmail.com',
        null,
        'active',
        [{ identityId: '84537482657274892684232', provider: 'google' }],
        [roleConstants.CUSTOMER.roleId],
      );

      expect(account.password).toBeNull();

      const jwt = authService.generateJWT(userId, 'google');

      const response = await request
        .patch(`${BASE_URL}/me/close`)
        .send({ provider: 'google' })
        .auth(jwt, { type: 'bearer' });

      expect(response.status).toBe(200);

      const u = await User.findByPk(userId);
      expect(u).toBeNull();

      const a = await UserAccount.findByPk(userId);
      expect(a).toBeNull();

      const identities = await UserIdentity.findAll({ where: { userId } });
      expect(identities.length).toBe(0);
    });
  });
});
