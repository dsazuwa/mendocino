import { ROLES } from '@app/modules/user';
import { tokenService } from '@app/modules/user/services';

import { request } from 'tests/supertest.helper';
import {
  createAdmin,
  createCustomer,
  createCustomerAndIdentity,
  createRoles,
} from '../../helper-functions';

import 'tests/db-setup';

const URL = '/api/test/greeting';

beforeAll(async () => {
  await createRoles();
});

it('should authenticate the request for an active admin', async () => {
  const { email } = await createAdmin(
    'Jess',
    'Doe',
    'jessdoe@gmail.com',
    'jessD0ePa$$',
    'active',
    [ROLES.ROOT.roleId],
  );
  const token = tokenService.generateAccessToken(email.email, 'email');

  await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
});

it('should authenticate the request for an active customer', async () => {
  const { email } = await createCustomer(
    'Jess',
    'Doe',
    'not.jessdoe@gmail.com',
    'jessD0ePa$$',
    'active',
  );
  const token = tokenService.generateAccessToken(email.email, 'email');

  await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
});

it('should authenticate the request for an active customer using third party auth', async () => {
  const { email } = await createCustomerAndIdentity(
    'Jess',
    'Doe',
    'notjessdoe@gmail.com',
    'jessD0ePa$$',
    'active',
    [{ identityId: '234w756532435674', provider: 'google' }],
  );
  const token = tokenService.generateAccessToken(email.email, 'email');

  await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
});

it('should authenticate the request for a pending account', async () => {
  const { email } = await createCustomer(
    'Jessie',
    'Doe',
    'jessiedoe@gmail.com',
    'jessieD0ePa$$',
    'active',
  );
  const token = tokenService.generateAccessToken(email.email, 'email');

  await request.get(URL).auth(token, { type: 'bearer' }).expect(200);
});

it('should return 401 Unauthorized for an invalid/undefined access token', async () => {
  await request.get(URL).auth('badtoken', { type: 'bearer' }).expect(401);

  await request.get(URL).expect(401);
});

it('should return 401 Unauthorized for a deactivated customer', async () => {
  const { email } = await createCustomer(
    'Jessica',
    'Doe',
    'jessica.doe@gmail.com',
    'jessD0ePa$$',
    'deactivated',
  );
  const token = tokenService.generateAccessToken(email.email, 'email');

  await request.get(URL).auth(token, { type: 'bearer' }).expect(401);
});
