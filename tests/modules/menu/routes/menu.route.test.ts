import { request } from 'tests/supertest.helper';

import { createMenu } from 'tests/modules/menu/helper-functions';

import 'tests/db-setup';

const BASE_URL = '/api/menu';

beforeAll(async () => {
  await createMenu();
});

it(`GET ${BASE_URL} should return current menu`, async () => {
  const response = await request.get(BASE_URL);
  expect(response.status).toBe(200);

  const { menu } = response.body;
  expect(menu.length).toBe(2);
});

it(`GET ${BASE_URL}/grouped should return current menu grouped by category`, async () => {
  const response = await request.get(`${BASE_URL}/grouped`);
  expect(response.status).toBe(200);

  const { menu } = response.body;
  expect(menu.length).toBe(2);

  const bowls = menu.filter(
    (i: { category: string }) => i.category === 'bowls',
  );
  expect(bowls[0].items.length).toBe(2);

  const kids = menu.filter((i: { category: string }) => i.category === 'kids');
  expect(kids[0].items.length).toBe(1);
});
