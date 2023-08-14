import authService from '@user/services/auth.service';
import { roleConstants } from '@user/utils/constants';

import { createUserAccount } from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/modules/user/user.mock.db';

describe('Authentication Middleware', () => {
  const URL = '/api/users/me/greeting';

  it('should authenticate the request for an active account', async () => {
    const { userId } = await createUserAccount(
      'Jess',
      'Doe',
      'jessdoe@gmail.com',
      'jessD0ePa$$',
      'active',
      [roleConstants.CUSTOMER.roleId],
    );
    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
  });

  it('should authenticate the request for a pending account', async () => {
    const { userId } = await createUserAccount(
      'Jessie',
      'Doe',
      'jessiedoe@gmail.com',
      'jessieD0ePa$$',
      'active',
      [roleConstants.CUSTOMER.roleId],
    );
    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
  });

  it('should return 401 Unauthorized for an invalid/undefined access token', async () => {
    await request.get(URL).auth('badtoken', { type: 'bearer' }).expect(401);

    await request.get(URL).expect(401);
  });

  it('should return 401 Unauthorized for a deactivated account', async () => {
    const { userId } = await createUserAccount(
      'Jessica',
      'Doe',
      'jessicadoe@gmail.com',
      'jessD0ePa$$',
      'inactive',
      [roleConstants.CUSTOMER.roleId],
    );
    const token = authService.generateJWT(userId, 'email');

    await request.get(URL).auth(token, { type: 'bearer' }).expect(401);
  });
});
