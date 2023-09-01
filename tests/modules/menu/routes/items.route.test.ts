import { ROLES } from '@App/modules/user';
import authService from '@user/services/auth.service';

import { createMenu } from 'tests/modules/menu/helper-functions';
import {
  createAdmin,
  createCustomer,
  createRoles,
} from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/menu/items';

let superJWT: string;
let managerJWT: string;
let customerJWT: string;

beforeAll(async () => {
  await createMenu();

  await createRoles();

  let email = 'joedoe@gmail.com';
  superJWT = authService.generateJWT(email, 'email');

  await createAdmin('Joe', 'Doe', email, 'joeD0ePa$$', 'active', [
    ROLES.SUPER_ADMIN.roleId,
  ]);

  email = 'jaydoe@gmail.com';
  managerJWT = authService.generateJWT(email, 'email');

  await createAdmin('Jay', 'Doe', email, 'jayD0ePa$$', 'active', [
    ROLES.MANAGER.roleId,
  ]);

  email = 'jessdoe@gmail.com';
  customerJWT = authService.generateJWT(email, 'email');

  await createCustomer('Jess', 'Doe', email, 'jessD0ePa$$', 'active');
});

it(`GET ${BASE_URL} should return all menu items`, async () => {
  await request.get(BASE_URL).expect(401);
  await request.get(BASE_URL).auth(customerJWT, { type: 'bearer' }).expect(401);

  let response = await request.get(BASE_URL).auth(superJWT, { type: 'bearer' });

  expect(response.status).toBe(200);
  expect(response.body.menu.length).toBe(6);

  response = await request.get(BASE_URL).auth(managerJWT, { type: 'bearer' });

  expect(response.status).toBe(200);
  expect(response.body.menu.length).toBe(6);
});
