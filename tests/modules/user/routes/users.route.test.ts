import { AuthOTP, User, UserAccount } from '@user/models';
import authService from '@user/services/auth.service';

import { request } from 'tests/supertest.helper';

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
});
