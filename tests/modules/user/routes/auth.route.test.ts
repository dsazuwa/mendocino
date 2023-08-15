import { Request, Response } from 'express';

import { facebookLogin, googleLogin } from '@user/controllers/auth.controller';
import { AuthOTP, User, UserAccount } from '@user/models';
import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';

import { getTokenFrom, request } from 'tests/supertest.helper';

import {
  createUserAccount,
  createUserAccountAndIdentity,
} from 'tests/modules/user/helper-functions';

import 'tests/user.db-setup';

const BASE_URL = '/api/auth';
const raw = true;

describe('Google Login', () => {
  it(`GET ${BASE_URL}/google`, async () => {
    await request.get(`${BASE_URL}/google`).expect(302);
    await request.get(`${BASE_URL}/google/callback`).expect(302);
  });

  it('google callback controller', async () => {
    const provider = 'google';

    const { userId } = await createUserAccountAndIdentity(
      'Jay',
      'Doe',
      'jaydoe@gmail.com',
      'jayD0ePa$$',
      'active',
      [{ identityId: '428402371863284', provider }],
      [ROLES.CUSTOMER.roleId],
    );

    const req = { user: { userId, status: 'active' } } as Request;
    const res = { redirect: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const token = authService.generateJWT(userId, provider);

    const userData = await authService.getUserData(userId, provider);
    expect(userData).toBeDefined();

    await googleLogin(req, res, next);

    expect(res.redirect).toHaveBeenLastCalledWith(
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
    const provider = 'facebook';

    const { userId } = await createUserAccountAndIdentity(
      'Jaz',
      'Doe',
      'jazdoe@gmail.com',
      'jazD0ePa$$',
      'active',
      [{ identityId: '42942742739273298', provider }],
      [ROLES.CUSTOMER.roleId],
    );

    const req = { user: { userId, status: 'active' } } as Request;
    const res = { redirect: jest.fn() } as unknown as Response;
    const next = jest.fn();

    const token = authService.generateJWT(userId, provider);

    const userData = await authService.getUserData(userId, provider);
    expect(userData).toBeDefined();

    await facebookLogin(req, res, next);

    expect(res.redirect).toHaveBeenLastCalledWith(
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
        raw,
      });

      const acct = await UserAccount.findOne({
        where: { email: data.email },
        raw,
      });

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

      await createUserAccount('Jean', 'Doe', email, password, 'inactive', [
        ROLES.CUSTOMER.roleId,
      ]);

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
      const email = 'jolenedoe@gmail.com';

      await createUserAccount('Jolene', 'Doe', email, null, 'active', [
        ROLES.CUSTOMER.roleId,
      ]);

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
    it('should create a new recover password otp', async () => {
      const email = 'janetdoe@gmail.com';

      const { userId } = await createUserAccount(
        'Janet',
        'Doe',
        email,
        'janetD0epa$$',
        'active',
        [ROLES.CUSTOMER.roleId],
      );

      await request.post(`${BASE_URL}/recover`).send({ email }).expect(200);

      const otp = await AuthOTP.findOne({
        where: { userId, type: 'password' },
        raw,
      });
      expect(otp).not.toBeNull();

      await request.post(`${BASE_URL}/recover`).send({ email }).expect(200);

      const newOTP = await AuthOTP.findOne({
        where: { userId, type: 'password' },
        raw,
      });
      expect(newOTP).not.toBeNull();
      expect(newOTP?.otpId).not.toEqual(otp?.otpId);
    });

    it('should fail to create new otp on user_account with null password', async () => {
      const email = 'jadoe@gmail.com';

      await createUserAccount('Ja', 'Doe', email, null, 'active', [
        ROLES.CUSTOMER.roleId,
      ]);

      await request.post(`${BASE_URL}/recover`).send({ email }).expect(403);
    });
  });

  describe(`POST ${BASE_URL}/recover/:otp`, () => {
    const email = 'jdoe@gmail.com';
    let userId: number;

    beforeAll(async () => {
      const { user } = await createUserAccount(
        'J',
        'Doe',
        email,
        'jD0ePa$$',
        'active',
        [ROLES.CUSTOMER.roleId],
      );
      userId = user.userId;
    });

    it('should verify user account for recovery', async () => {
      await AuthOTP.destroy({
        where: { userId, type: 'password' },
      });

      await AuthOTP.create({
        userId,
        type: 'password',
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
      const { user } = await createUserAccount(
        'Jin',
        'Doe',
        email,
        'jinD0ePa$$',
        'active',
        [ROLES.CUSTOMER.roleId],
      );
      userId = user.userId;
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
        where: { userId, type: 'password' },
      });

      await AuthOTP.create({
        userId,
        type: 'password',
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
        where: { userId, type: 'password' },
      });

      await AuthOTP.create({
        userId,
        type: 'password',
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
        where: { userId, type: 'password' },
        raw,
      });

      expect(usedOTP).toBeNull();
    });
  });

  describe(`PATCH ${BASE_URL}/reactivate`, () => {
    it('should reactivate inactive user', async () => {
      const status = 'inactive';

      const { userId } = await createUserAccount(
        'Janelle',
        'Doe',
        'janelledoe@gmail.com',
        'janelleD0ePa$$',
        status,
        [ROLES.CUSTOMER.roleId],
      );

      const token = authService.generateJWT(userId, 'email');

      let a = await UserAccount.findOne({ where: { userId, status }, raw });
      expect(a).not.toBeNull();

      await request
        .patch(`${BASE_URL}/reactivate`)
        .auth(token, { type: 'bearer' })
        .expect(200);

      a = await UserAccount.findOne({
        where: { userId, status: 'active' },
        raw,
      });
      expect(a).not.toBeNull();
    });

    it('should fail for active user', async () => {
      const status = 'active';

      const { userId } = await createUserAccount(
        'Josee',
        'Doe',
        'joseedoe@gmail.com',
        'joseeD0ePa$$',
        status,
        [ROLES.CUSTOMER.roleId],
      );

      const token = authService.generateJWT(userId, 'email');

      let a = UserAccount.findOne({ where: { userId, status }, raw });
      expect(a).resolves.not.toBeNull();

      await request
        .patch(`${BASE_URL}/reactivate`)
        .auth(token, { type: 'bearer' })
        .expect(401);

      a = UserAccount.findOne({ where: { userId, status }, raw });
      expect(a).not.toBeNull();
    });

    it('should fail for pending user', async () => {
      const status = 'pending';

      const { userId } = await createUserAccount(
        'Jaclyn',
        'Doe',
        'jaclyndoe@gmail.com',
        'jaclynD0ePa$$',
        status,
        [ROLES.CUSTOMER.roleId],
      );

      const token = authService.generateJWT(userId, 'email');

      let a = UserAccount.findOne({ where: { userId, status }, raw });
      expect(a).resolves.not.toBeNull();

      await request
        .patch(`${BASE_URL}/reactivate`)
        .auth(token, { type: 'bearer' })
        .expect(401);

      a = UserAccount.findOne({ where: { userId, status }, raw });
      expect(a).not.toBeNull();
    });
  });
});
