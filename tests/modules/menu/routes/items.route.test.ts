import { ROLES } from '@App/modules/user';
import authService from '@user/services/auth.service';

import { Category, Item, ItemCategory } from '@menu/models';

import { createItem, createMenu } from 'tests/modules/menu/helper-functions';
import {
  createAdmin,
  createCustomer,
  createRoles,
} from 'tests/modules/user/helper-functions';
import { request } from 'tests/supertest.helper';

import 'tests/db-setup';

const BASE_URL = '/api/menu/items';

let superJwt: string;
let managerJwt: string;
let customerJwt: string;

beforeAll(async () => {
  await createMenu();

  await createRoles();

  let email = 'joedoe@gmail.com';
  superJwt = authService.generateJwt(email, 'email');

  await createAdmin('Joe', 'Doe', email, 'joeD0ePa$$', 'active', [
    ROLES.SUPER_ADMIN.roleId,
  ]);

  email = 'jaydoe@gmail.com';
  managerJwt = authService.generateJwt(email, 'email');

  await createAdmin('Jay', 'Doe', email, 'jayD0ePa$$', 'active', [
    ROLES.MANAGER.roleId,
  ]);

  email = 'jessdoe@gmail.com';
  customerJwt = authService.generateJwt(email, 'email');

  await createCustomer('Jess', 'Doe', email, 'jessD0ePa$$', 'active');
});

describe(`GET ${BASE_URL}`, () => {
  it('should return all menu items', async () => {
    await request.get(BASE_URL).expect(401);
    await request
      .get(BASE_URL)
      .auth(customerJwt, { type: 'bearer' })
      .expect(401);

    let response = await request
      .get(BASE_URL)
      .auth(superJwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.menu.length).toBe(6);

    response = await request.get(BASE_URL).auth(managerJwt, { type: 'bearer' });

    expect(response.status).toBe(200);
    expect(response.body.menu.length).toBe(6);
  });
});

describe(`POST ${BASE_URL}`, () => {
  beforeEach(async () => {
    await Item.destroy({ where: {} });
  });

  it('should create item', async () => {
    const data = {
      name: 'Prosciutto & Chicken',
      description:
        'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      category: 'foodie favorites',
      tags: ['N', 'RGF'],
      prices: [{ size: 'default', price: '12.65' }],
      photoUrl: 'ProsciuttoChicken.jpg',
      status: 'active',
    };

    const response = await request
      .post(BASE_URL)
      .send(data)
      .auth(superJwt, { type: 'bearer' });

    expect(response.status).toBe(200);
  });

  it('should fail to create item on invalid price', async () => {
    const data = {
      name: 'Prosciutto & Chicken',
      description:
        'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      category: 'foodie favorites',
      tags: ['N', 'RGF'],
      prices: [
        { size: 'small', price: '6.65' },
        { size: 'default', price: '12.65' },
      ],
      photoUrl: 'ProsciuttoChicken.jpg',
      status: 'active',
    };

    await request
      .post(BASE_URL)
      .send(data)
      .auth(superJwt, { type: 'bearer' })
      .expect(400);
  });
});

describe(`PATCH ${BASE_URL}/:id`, () => {
  let itemId: number;

  beforeEach(async () => {
    await Item.destroy({ where: {} });

    const category = await Category.findOne({
      where: { name: 'foodie favorites' },
      raw: true,
    });

    const item = await createItem(
      'Prosciutto & Chicken',
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      category?.categoryId || -1,
      null,
      [{ sizeId: null, price: '12.65' }],
      'active',
      'ProsciuttoChicken.jpg',
    );

    itemId = item.itemId;
  });

  it('should update item name', async () => {
    const name = 'Prosciutto & Chicken';

    const response = await request
      .patch(`${BASE_URL}/${itemId}`)
      .send({ name })
      .auth(superJwt, { type: 'bearer' });

    expect(response.status).toBe(200);

    const item = await Item.findOne({ where: { itemId, name }, raw: true });
    expect(item).not.toBeNull();
  });

  it('should update item category', async () => {
    const category = 'bowls';

    const response = await request
      .patch(`${BASE_URL}/${itemId}`)
      .send({ category })
      .auth(superJwt, { type: 'bearer' });

    expect(response.status).toBe(200);

    const c = await Category.findOne({
      where: { name: category },
      raw: true,
    });

    const categoryId = c ? c.categoryId : -1;

    const item = await ItemCategory.findOne({
      where: { itemId, categoryId },
      raw: true,
    });
    expect(item).not.toBeNull();
  });

  it('should fail to update on invalid category', async () => {
    await request
      .patch(`${BASE_URL}/${itemId}`)
      .send({ name: 'Prosciutto & Chicken', category: 'foodies' })
      .auth(superJwt, { type: 'bearer' })
      .expect(400);
  });

  it('should fail to update on invalid status', async () => {
    await request
      .patch(`${BASE_URL}/${itemId}`)
      .send({ status: 'foodies' })
      .auth(superJwt, { type: 'bearer' })
      .expect(400);
  });
});

describe(`PATCH ${BASE_URL}/:id/status`, () => {
  let categoryId: number;

  beforeAll(async () => {
    const category = await Category.findOne({
      where: { name: 'foodie favorites' },
      raw: true,
    });
    categoryId = category?.categoryId || -1;
  });

  beforeEach(async () => {
    await Item.destroy({ where: {} });
  });

  it('should update active status to sold out', async () => {
    const { itemId } = await createItem(
      'Prosciutto & Chicken',
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      categoryId,
      null,
      [{ sizeId: null, price: '12.65' }],
      'active',
      'ProsciuttoChicken.jpg',
    );

    const status = 'sold out';

    await request
      .patch(`${BASE_URL}/${itemId}/status`)
      .send({ status })
      .auth(managerJwt, { type: 'bearer' })
      .expect(200);

    const item = await Item.findOne({ where: { itemId, status }, raw: true });
    expect(item).not.toBeNull();
  });

  it('should update sold out status to active', async () => {
    const { itemId } = await createItem(
      'Prosciutto & Chicken',
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      categoryId,
      null,
      [{ sizeId: null, price: '12.65' }],
      'sold out',
      'ProsciuttoChicken.jpg',
    );

    const status = 'active';

    await request
      .patch(`${BASE_URL}/${itemId}/status`)
      .send({ status })
      .auth(managerJwt, { type: 'bearer' })
      .expect(200);

    const item = await Item.findOne({ where: { itemId, status }, raw: true });
    expect(item).not.toBeNull();
  });

  it('should fail to update to same status', async () => {
    const status = 'active';

    const { itemId } = await createItem(
      'Prosciutto & Chicken',
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      categoryId,
      null,
      [{ sizeId: null, price: '12.65' }],
      status,
      'ProsciuttoChicken.jpg',
    );

    await request
      .patch(`${BASE_URL}/${itemId}/status`)
      .send({ status })
      .auth(managerJwt, { type: 'bearer' })
      .expect(400);
  });

  it('should fail to update status if current status is not one of active/sold out', async () => {
    const { itemId } = await createItem(
      'Prosciutto & Chicken',
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      categoryId,
      null,
      [{ sizeId: null, price: '12.65' }],
      'coming soon',
      'ProsciuttoChicken.jpg',
    );

    await request
      .patch(`${BASE_URL}/${itemId}/status`)
      .send({ status: 'active' })
      .auth(managerJwt, { type: 'bearer' })
      .expect(400);
  });
});

describe(`DELETE ${BASE_URL}/:id`, () => {
  let categoryId: number;

  beforeAll(async () => {
    await Item.destroy({ where: {} });

    const category = await Category.findOne({
      where: { name: 'foodie favorites' },
      raw: true,
    });
    categoryId = category?.categoryId || -1;
  });

  it('should delete item', async () => {
    const { itemId } = await createItem(
      'Prosciutto & Chicken',
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta',
      categoryId,
      null,
      [{ sizeId: null, price: '12.65' }],
      'active',
      'ProsciuttoChicken.jpg',
    );

    await request
      .delete(`${BASE_URL}/${itemId}`)
      .auth(superJwt, { type: 'bearer' })
      .expect(200);

    const item = await Item.findOne({ where: { itemId }, raw: true });
    expect(item).toBeNull();
  });

  it('should fail to delete if item does not exist', async () => {
    await request
      .delete(`${BASE_URL}/-1`)
      .auth(superJwt, { type: 'bearer' })
      .expect(400);
  });
});
