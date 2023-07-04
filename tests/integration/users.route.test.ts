import { Token, User } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

const BASE_URL = '/api/users';

describe('User Routes', () => {
  const data = {
    firstName: 'Joyce',
    lastName: 'Doe',
    email: 'joycedoe@gmail.com',
    password: 'joyceD0epa$$',
  };

  let user: User;
  let token: string;

  beforeAll(async () => {
    user = await User.create(data);
    token = user.generateJWT();
  });

  describe('CRUD User', () => {
    it('GET /me should return basic user information', async () => {
      const response = await request.get(`${BASE_URL}/me`).auth(token, { type: 'bearer' });
      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();

      const user = response.body.user;
      expect(user.firstName).toEqual(data.firstName);
      expect(user.lastName).toEqual(data.lastName);
      expect(user.email).toEqual(data.email);
      expect(user.password).not.toBeDefined();
    });
  });

  describe('User Verification', () => {
    it('POST /me/verify should create a new verification token', async () => {
      await request.post(`${BASE_URL}/me/verify`).auth(token, { type: 'bearer' }).expect(200);
    });

    it('PUT /me/verify/:code should fail on invalid code', async () => {
      const response = await request
        .put(`${BASE_URL}/me/verify/111`)
        .auth(token, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Invalid code');
    });

    it('PUT /me/verify/:code should fail on non-numeric code', async () => {
      const response = await request
        .put(`${BASE_URL}/me/verify/11fjfd1111`)
        .auth(token, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('API Validation Error');
    });

    it('PUT /me/verify/:code should fail on expired code', async () => {
      await Token.destroy({ where: { userId: user.id, type: 'verify' } });

      const code = await Token.create({
        userId: user.id,
        type: 'verify',
        code: Token.generateCode(),
        expiresAt: new Date(),
      });

      const response = await request
        .put(`${BASE_URL}/me/verify/${code.code}`)
        .auth(token, { type: 'bearer' });

      expect(response.status).toBe(400);
      expect(response.body.message).toEqual('Invalid code');
    });

    it('PUT /me/verify/:code should verify user ', async () => {
      await Token.destroy({ where: { userId: user.id, type: 'verify' } });

      const code = await user.createToken({
        type: 'verify',
        code: Token.generateCode(),
        expiresAt: Token.getExpiration(),
      });

      await request
        .put(`${BASE_URL}/me/verify/${code.code}`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      const retrievedUser = await User.findOne({ where: { email: data.email } });
      expect(retrievedUser?.status).toEqual('active');
    });
  });
});
