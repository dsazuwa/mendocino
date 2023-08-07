import { User, UserAccount } from '@user/models';
import authService from '@user/services/auth.service';

import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

describe('Authentication Middleware', () => {
  const URL = '/api/users/me/greeting';

  it('should authenticate the request with a valid access token', async () => {
    const { userId } = await User.create({
      firstName: 'Jess',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'jessdoe@gmail.com',
      password: 'jessD0ePas$$',
    });

    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
  });

  it('should return 401 Unauthorized for an invalid/undefined access token', async () => {
    await request.get(URL).auth('badtoken', { type: 'bearer' }).expect(401);

    await request.get(URL).expect(401);
  });

  it('should return 401 Unauthorized for a deactivated account', async () => {
    const { userId } = await User.create({
      firstName: 'Jessica',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'jessicadoe@gmail.com',
      password: 'jessD0ePs$$',
      status: 'inactive',
    });

    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(401);
  });
});