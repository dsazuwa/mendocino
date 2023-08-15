import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/modules/user/user.mock.db';

describe('Inative Authentication Middleware', () => {
  const URL = '/api/users/me/inactive/greeting';

  it('should authenticate the request with a valid access token', async () => {
    const { userId } = await createUserAccount(
      'Jess',
      'Doe',
      'jessdoe@gmail.com',
      'jessD0ePa$$',
      'inactive',
      [ROLES.CUSTOMER.roleId],
    );
    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
  });

  it('should return 401 Unauthorized for an invalid/undefined access token', async () => {
    await request.get(URL).auth('badtoken', { type: 'bearer' }).expect(401);

    await request.get(URL).expect(401);
  });

  it('should return 401 Unauthorized for an active account', async () => {
    const { userId } = await createUserAccount(
      'Jessica',
      'Doe',
      'jessicadoe@gmail.com',
      'jessD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );
    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(401);
  });

  it('should return 401 Unauthorized for a pending account', async () => {
    const { userId } = await createUserAccount(
      'Jazz',
      'Doe',
      'jazzdoe@gmail.com',
      'jazzD0ePs$$',
      'pending',
      [ROLES.CUSTOMER.roleId],
    );
    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(401);
  });
});
