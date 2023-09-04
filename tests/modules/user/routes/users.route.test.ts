import authService from '@user/services/auth.service';
import { ROLES } from '@user/utils/constants';

import {
  createAdmin,
  createCustomer,
  createRoles,
} from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/users';

beforeAll(async () => {
  createRoles();
});

describe(`GET ${BASE_URL}/me`, () => {
  it('return data for pending customer', async () => {
    const firstName = 'Joyce';
    const lastName = 'Doe';
    const email = 'joycedoe@gmail.com';
    const password = 'joyceD0epa$$';
    const status = 'pending';

    await createCustomer(firstName, lastName, email, password, status);

    const jwt = authService.generateJwt(email, 'email');

    const response = await request
      .get(`${BASE_URL}/me`)
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      firstName,
      lastName,
      email,
      status,
      roles: ['customer'],
    });
  });

  it('return data for admin', async () => {
    const { CUSTOMER_SUPPORT, MANAGER } = ROLES;

    const firstName = 'Joyce';
    const lastName = 'Doe';
    const email = 'notjoycedoe@gmail.com';
    const password = 'joyceD0epa$$';
    const status = 'pending';

    await createAdmin(firstName, lastName, email, password, status, [
      CUSTOMER_SUPPORT.roleId,
      MANAGER.roleId,
    ]);

    const jwt = authService.generateJwt(email, 'email');

    const response = await request
      .get(`${BASE_URL}/me`)
      .auth(jwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({
      firstName,
      lastName,
      email,
      status,
      roles: [CUSTOMER_SUPPORT.name, MANAGER.name],
    });
  });
});
