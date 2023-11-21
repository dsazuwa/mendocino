import tokenService from '@app/modules/user/services/token.service';
import { ROLES } from '@app/modules/user/utils/constants';

import { request } from 'tests/supertest.helper';
import { createAdmin, createCustomer, createRoles } from '../helper-functions';

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

    const jwt = tokenService.generateAccessToken(email, 'email');

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

    const jwt = tokenService.generateAccessToken(email, 'email');

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
