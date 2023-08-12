import { Request, Response } from 'express';

import { facebookLogin, googleLogin } from '@user/controllers/auth.controller';
import { AuthOTP, User, UserAccount, UserIdentity } from '@user/models';
import authService from '@user/services/auth.service';
import userService from '@user/services/user.service';

import { getTokenFrom, request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/auth';

describe('Google Login', () => {
  it(`GET ${BASE_URL}/google`, async () => {
    await request.get(`${BASE_URL}/google`).expect(302);
    await request.get(`${BASE_URL}/google/callback`).expect(302);
  });

  it('google callback controller', async () => {
    const { userId } = await User.create({ firstName: 'Jay', lastName: 'Doe' });

    await UserAccount.create({
      userId,
      email: 'jaydoe@gmail.com',
      password: 'jayD0ePa$$',
    });

    await UserIdentity.create({
      userId,
      id: '428402371863284',
      providerType: 'google',
    });

    const req = { user: { userId, status: 'active' } } as Request;
    const res = { redirect: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const token = authService.generateJWT(userId, 'google');
    const userData = await userService.getUserData(userId);

    await googleLogin(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(
      `${
        process.env.FRONTEND_BASE_URL
      }/OAuthRedirecting?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userData),
      )}`,
    );
  });
});

describe('Facebook Login', () => {
  // it(`GET ${BASE_URL}/facebook`, async () => {
  //   await request.get(`${BASE_URL}/facebook`).expect(302);
  //   await request.get(`${BASE_URL}/facebook/callback`).expect(302);
  // });

  it('facebook callback controller', async () => {
    const { userId } = await User.create({ firstName: 'Jaz', lastName: 'Doe' });

    await UserAccount.create({
      userId,
      email: 'jazdoe@gmail.com',
      password: 'jazD0ePa$$',
    });

    await UserIdentity.create({
      userId,
      id: '42942742739273298',
      providerType: 'facebook',
    });

    const req = { user: { userId, status: 'active' } } as Request;
    const res = { redirect: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const token = authService.generateJWT(userId, 'facebook');
    const userData = await userService.getUserData(userId);

    await facebookLogin(req, res, next);

    expect(res.redirect).toHaveBeenCalledWith(
      `${
        process.env.FRONTEND_BASE_URL
      }/OAuthRedirecting?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userData),
      )}`,
    );
  });
});

describe('Email Authentication', () => {
  const data = {
    firstName: 'Jessica',
    lastName: 'Doe',
    email: 'jessicadoe@gmail.com',
    password: 'jessicaD0epa$$',
  };

  describe(`POST ${BASE_URL}/register`, () => {
    it(`should pass for valid data`, async () => {
      const response = await request.post(`${BASE_URL}/register`).send(data);
      expect(response.status).toBe(200);

      const user = await User.findOne({
        where: { firstName: data.firstName, lastName: data.lastName },
      });

      const acct = await UserAccount.findOne({ where: { email: data.email } });

      expect(user).not.toBeNull();
      expect(acct).not.toBeNull();

      expect(user?.userId).toBe(acct?.userId);
      expect(user?.firstName).toBe(data.firstName);

      const token = getTokenFrom(response.headers['set-cookie']);
      expect(token).not.toEqual('');
    });

    it(`should fail for duplicate email`, async () => {
      await request.post(`${BASE_URL}/register`).send(data).expect(409);
    });
  });

  describe(`POST ${BASE_URL}/login`, () => {
    it('should pass for correct credentials', async () => {
      const response = await request
        .post(`${BASE_URL}/login`)
        .send({ email: data.email, password: data.password });

      expect(response.status).toBe(200);

      const token = getTokenFrom(response.headers['set-cookie']);
      expect(token).not.toEqual('');
    });

    it('should fail for wrong password', async () => {
      const response = await request
        .post(`${BASE_URL}/login`)
        .send({ email: data.email, password: 'wrong-password' });

      expect(response.status).toBe(401);

      const token = getTokenFrom(response.headers['set-cookie']);
      expect(token).toEqual('');
    });

    it('should fail for deactivated account', async () => {
      const email = 'jeandoe@gmail.com';
      const password = 'jeanD0ePa$$';

      const { userId } = await User.create({
        firstName: 'Jean',
        lastName: 'Doe',
      });

      await UserAccount.create({ userId, email, password, status: 'inactive' });

      const response = await request
        .post(`${BASE_URL}/login`)
        .send({ email, password });

      expect(response.status).toBe(403);

      const token = getTokenFrom(response.headers['set-cookie']);
      expect(token).toEqual('');

      const { accessToken, user } = response.body;

      expect(user).toBeDefined();
      expect(accessToken).toBeDefined();
    });

    it('should fail for user_account with null password', async () => {
      const { userId } = await User.create({
        firstName: 'Jolene',
        lastName: 'Doe',
      });

      const { email } = await UserAccount.create({
        userId,
        email: 'jolenedoe@gmail.com',
      });

      const response = await request
        .post(`${BASE_URL}/login`)
        .send({ email, password: 'wrong-password' });

      expect(response.status).toBe(401);

      const token = getTokenFrom(response.headers['set-cookie']);
      expect(token).toEqual('');
    });
  });

  it(`POST ${BASE_URL}/logout`, async () => {
    const response = await request.post(`${BASE_URL}/logout`);
    expect(response.status).toBe(200);

    const token = getTokenFrom(response.headers['set-cookie']);
    expect(token).toEqual('');
  });
});

describe('Recover Account', () => {
  const mockOTP = '123456';

  describe(`POST ${BASE_URL}/recover`, () => {
    it('should create a new recover otp', async () => {
      const email = 'janetdoe@gmail.com';

      const { userId } = await User.create({
        firstName: 'Janet',
        lastName: 'Doe',
      });
      await UserAccount.create({ userId, email, password: 'janetD0epa$$' });

      await request.post(`${BASE_URL}/recover`).send({ email }).expect(200);

      const otp = await AuthOTP.findOne({ where: { userId, type: 'recover' } });
      expect(otp).not.toBeNull();

      await request.post(`${BASE_URL}/recover`).send({ email }).expect(200);

      const newOTP = await AuthOTP.findOne({
        where: { userId, type: 'recover' },
      });
      expect(newOTP).not.toBeNull();
      expect(newOTP?.id).not.toEqual(otp?.id);
    });

    it('should fail to create new otp on user_account with null password', async () => {
      const { userId } = await User.create({
        firstName: 'Ja',
        lastName: 'Doe',
      });

      const email = 'jadoe@gmail.com';
      await UserAccount.create({ userId, email });

      await request.post(`${BASE_URL}/recover`).send({ email }).expect(403);
    });
  });

  describe(`POST ${BASE_URL}/recover/:otp`, () => {
    const email = 'jdoe@gmail.com';
    let userId: number;

    beforeAll(async () => {
      const u = await User.create({ firstName: 'J', lastName: 'Doe' });
      userId = u.userId;

      await UserAccount.create({ userId, email, password: 'jD0ePa$$' });
    });

    it('should verify user account for recovery', async () => {
      await AuthOTP.destroy({
        where: { userId, type: 'recover' },
      });

      await AuthOTP.create({
        userId,
        type: 'recover',
        password: mockOTP,
        expiresAt: AuthOTP.getExpiration(),
      });

      await request
        .post(`${BASE_URL}/recover/${mockOTP}`)
        .send({ email })
        .expect(200);
    });

    it('should fail for non-numeric otp', async () => {
      await request
        .post(`${BASE_URL}/recover/nonnumeric`)
        .send({ email })
        .expect(400);
    });

    it('should fail for wrong otp', async () => {
      await request
        .post(`${BASE_URL}/recover/121241`)
        .send({ email })
        .expect(401);
    });
  });

  describe(`PATCH ${BASE_URL}/recover/:otp`, () => {
    const newPassword = 'jinsNewD0epa$$';
    const email = 'jindoe@gmail.com';

    let userId: number;

    beforeAll(async () => {
      const u = await User.create({ firstName: 'Jin', lastName: 'Doe' });
      userId = u.userId;

      await UserAccount.create({ userId, email, password: 'jinD0ePa$$' });
    });
    it('should fail on invalid password', async () => {
      await request
        .patch(`${BASE_URL}/recover/${mockOTP}`)
        .send({ email, password: 'newpassword' })
        .expect(400);
    });

    it('should fail on non-numeric otp', async () => {
      await request
        .patch(`${BASE_URL}/recover/non0numeric`)
        .send({ email, password: 'newPa$$w0rd' })
        .expect(400);
    });

    it('should fail on wrong otp', async () => {
      await request
        .patch(`${BASE_URL}/recover/0111`)
        .send({ email, password: newPassword })
        .expect(401);
    });

    it('should fail on expired otp', async () => {
      await AuthOTP.destroy({
        where: { userId, type: 'recover' },
      });

      await AuthOTP.create({
        userId,
        type: 'recover',
        password: mockOTP,
        expiresAt: new Date(),
      });

      await request
        .patch(`${BASE_URL}/recover/${mockOTP}`)
        .send({ email, password: newPassword })
        .expect(401);
    });

    it('should reset password', async () => {
      await AuthOTP.destroy({
        where: { userId, type: 'recover' },
      });

      await AuthOTP.create({
        userId,
        type: 'recover',
        password: mockOTP,
        expiresAt: AuthOTP.getExpiration(),
      });

      await request
        .patch(`${BASE_URL}/recover/${mockOTP}`)
        .send({ email, password: newPassword })
        .expect(200);

      await request
        .post(`/api/auth/login`)
        .send({ email, password: newPassword })
        .expect(200);

      const usedOTP = await AuthOTP.findOne({
        where: { userId, type: 'recover' },
      });

      expect(usedOTP).toBeNull();
    });
  });
});
