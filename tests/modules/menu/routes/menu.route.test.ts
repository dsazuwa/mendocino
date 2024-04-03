import { request } from 'tests/supertest.helper';
import { createMenu } from '../helper-functions';

import 'tests/db-setup';

const BASE_URL = '/api/menu';

beforeAll(async () => {
  await createMenu();
});

// it(`GET ${BASE_URL} should return current menu`, async () => {
//   const response = await request.get(BASE_URL);
//   expect(response.status).toBe(200);

//   const { menu } = response.body;
//   expect(menu.length).toBe(3);
// });

it(`GET ${BASE_URL}/grouped should return current menu grouped by category`, async () => {
  const response = await request.get(`${BASE_URL}/grouped`);
  expect(response.status).toBe(200);

  const { categories, menu } = response.body;

  expect(categories).toStrictEqual([
    "chef's creations",
    'foodie favorites',
    'bowls',
    'kids',
  ]);

  const [chef, foodie, bowls, kids] = menu;

  expect(chef.category).toBe("chef's creations");
  expect(chef.subCategories[0].items).toHaveLength(2);

  expect(foodie.category).toBe('foodie favorites');
  expect(foodie.subCategories[0].items).toHaveLength(1);

  expect(bowls.category).toBe('bowls');
  expect(bowls.subCategories[0].items).toHaveLength(2);

  expect(kids.category).toBe('kids');
  expect(kids.subCategories[0].items).toHaveLength(1);
});
