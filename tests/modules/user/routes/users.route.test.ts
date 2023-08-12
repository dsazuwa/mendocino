import { JwtPayload, verify } from 'jsonwebtoken';

import { AuthOTP, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';

import { getTokenFrom, request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/users';

describe('Users Routes', () => {
  describe(`GET ${BASE_URL}/me`, () => {
    it('return data for pending user', async () => {
      const firstName = 'Joyce';
      const lastName = 'Doe';
      const email = 'joycedoe@gmail.com';
      const password = 'joyceD0epa$$';
      const status = 'pending';

      const { userId } = await User.create({ firstName, lastName });
      await UserAccount.create({ userId, email, password, status });

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
      const u = await User.create({ firstName: 'Jaz', lastName: 'Doe' });
      userId = u.userId;

      await UserAccount.create({
        userId,
        email: 'jazdoe@gmail.com',
        password: 'jazD0ePa$$',
        status: 'pending',
      });

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
      const { id } = otp as AuthOTP;

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(jwt, { type: 'bearer' })
        .expect(200);

      const otps = await AuthOTP.findAll({ where: { userId, type: 'verify' } });
      expect(otps.length).toBe(1);

      const [newOTP] = otps;
      expect(newOTP).not.toBeNull();
      expect(newOTP?.id).not.toBe(id);
    });

    it('should fail for active user', async () => {
      const u = await User.create({ firstName: 'Jeff', lastName: 'Doe' });
      await UserAccount.create({
        userId: u.userId,
        email: 'jeffdoe@gmail.com',
        status: 'active',
      });

      const token = authService.generateJWT(u.userId, 'email');

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
      const u = await User.create({ firstName: 'Jax', lastName: 'Doe' });
      userId = u.userId;

      await UserAccount.create({
        userId,
        email: 'jaxdoe@gmail.com',
        password: 'jazD0ePa$$',
        status: 'pending',
      });

      jwt = authService.generateJWT(userId, 'email');
    });

    it('should fail for active user', async () => {
      const u = await User.create({ firstName: 'Jess', lastName: 'Doe' });
      await UserAccount.create({
        userId: u.userId,
        email: 'jessdoe@gmail.com',
        status: 'active',
      });

      const token = authService.generateJWT(u.userId, 'email');

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
      const { userId } = await User.create({
        firstName: 'Jamie',
        lastName: 'Doe',
      });

      let a: UserAccount | null = await UserAccount.create({
        userId,
        email: 'jaimedoe@gmail.com',
      });

      const jwt = authService.generateJWT(userId, 'email');
      const password = 'jaimeD0ePa$$';

      expect(a?.comparePasswords(password)).toBe(false);

      await request
        .post(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ password })
        .expect(200);

      a = await UserAccount.findByPk(userId);
      expect(a?.comparePasswords(password)).toBe(true);
    });

    it('should fail to create password for account with non-null password', async () => {
      const { userId } = await User.create({
        firstName: 'Julien',
        lastName: 'Doe',
      });

      let a: UserAccount | null = await UserAccount.create({
        userId,
        email: 'juliendoe@gmail.com',
        password: 'julienD0ePa$$',
      });

      const jwt = authService.generateJWT(userId, 'email');
      const password = 'newJulienD0ePa$$';

      expect(a?.comparePasswords(password)).toBe(false);

      await request
        .post(`${BASE_URL}/me/password`)
        .auth(jwt, { type: 'bearer' })
        .send({ password })
        .expect(409);

      a = await UserAccount.findByPk(userId);
      expect(a?.comparePasswords(password)).toBe(false);
    });
  });

  describe(`PATCH ${BASE_URL}/me/password`, () => {
    const password = 'jeanD0ePa$$';

    let userId: number;
    let jwt: string;

    beforeAll(async () => {
      const user = await User.create({
        firstName: 'Jeanette',
        lastName: 'Doe',
      });

      userId = user.userId;
      jwt = authService.generateJWT(userId, 'email');

      await UserAccount.create({
        userId,
        email: 'jeanettedoe@gmail.com',
        password,
      });
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
      const { userId } = await User.create({
        firstName: 'Jennifer',
        lastName: 'Doe',
      });

      const a = await UserAccount.create({
        userId,
        email: 'jennifer@gmail.com',
        password: 'jessicaD0ePa$$',
      });

      expect(a.password).not.toBeNull();

      await UserIdentity.create({
        id: '3654755345356474363',
        userId,
        providerType: 'google',
      });

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
      expect(decoded.providerType).toBe('email');
    });

    it('should delete identity if user has no account with a password, but has some other identity', async () => {
      const { userId } = await User.create({
        firstName: 'Jack',
        lastName: 'Doe',
      });

      const acct = await UserAccount.create({
        userId,
        email: 'jackdoe@gmail.com',
      });

      expect(acct.password).toBeNull();

      await UserIdentity.create({
        id: '687453534367486564',
        userId,
        providerType: 'google',
      });

      await UserIdentity.create({
        id: '234267589676438787',
        userId,
        providerType: 'facebook',
      });

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
      expect(decoded.providerType).toBe('facebook');

      let i = await UserIdentity.findOne({
        where: { userId, providerType: 'google' },
      });
      expect(i).toBeNull();

      i = await UserIdentity.findOne({
        where: { userId, providerType: 'facebook' },
      });
      expect(i).not.toBeNull();
    });

    it('should delete user if user has neither an account with a password, nor some other identity', async () => {
      const { userId } = await User.create({
        firstName: 'Jas',
        lastName: 'Doe',
      });

      const a = await UserAccount.create({
        userId,
        email: 'jasdoe@gmail.com',
      });

      expect(a.password).toBeNull();

      await UserIdentity.create({
        id: '7934872657237824972478',
        userId,
        providerType: 'google',
      });

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
});
