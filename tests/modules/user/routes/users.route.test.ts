import { AuthOTP, User, UserAccount } from '@user/models';
import authService from '@user/services/auth.service';

import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/users';

describe('Users Routes', () => {
  let userId: number;
  let token: string;

  const mockOTP = '123456';

  const firstName = 'Joyce';
  const lastName = 'Doe';
  const email = 'joycedoe@gmail.com';
  const password = 'joyceD0epa$$';
  const status = 'pending';

  beforeAll(async () => {
    const u = await User.create({ firstName, lastName });
    userId = u.userId;

    await UserAccount.create({ userId, email, password, status });
    token = authService.generateJWT(userId, 'email');
  });

  it(`GET ${BASE_URL}/me`, async () => {
    const response = await request
      .get(`${BASE_URL}/me`)
      .auth(token, { type: 'bearer' });

    expect(response.status).toBe(200);

    const { user } = response.body;
    expect(user).toMatchObject({ firstName, lastName, email, status });
  });

  describe(`POST ${BASE_URL}/me/verify`, () => {
    it('should create a new verification token', async () => {
      let otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      expect(otp).toBeNull();

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      expect(otp).not.toBeNull();
    });

    it('should destroy previous verification token', async () => {
      const otp = await AuthOTP.findOne({ where: { userId, type: 'verify' } });
      const { id } = otp as AuthOTP;

      await request
        .post(`${BASE_URL}/me/verify`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const otps = await AuthOTP.findAll({ where: { userId, type: 'verify' } });
      expect(otps.length).toBe(1);

      const [newOTP] = otps;
      expect(newOTP).not.toBeNull();
      expect(newOTP?.id).not.toBe(id);
    });
  });

  describe(`PATCH ${BASE_URL}/me/verify/:otp`, () => {
    it('should fail on wrong otp', async () => {
      await request
        .patch(`${BASE_URL}/me/verify/111111`)
        .auth(token, { type: 'bearer' })
        .expect(401);
    });

    it('should fail on non-numeric otp', async () => {
      await request
        .patch(`${BASE_URL}/me/verify/nonnumeric`)
        .auth(token, { type: 'bearer' })
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
        .auth(token, { type: 'bearer' })
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
        .auth(token, { type: 'bearer' })
        .expect(200);

      const retrievedAcct = await UserAccount.findByPk(userId);
      expect(retrievedAcct?.status).toEqual('active');
    });
  });
});
