import { Menu, MenuCategoryType, MenuStatusType } from '../../src/models';
import '../utils/db-setup';
import { request } from '../utils/supertest.helper';

const BASE_URL = '/api/menu';

describe('Menu', () => {
  const menuData = [
    {
      name: 'Avocado & Quinoa Superfood Ensalada',
      description:
        'chopped romaine, curly kale, quinoa & millet, housemade superfood krunchies, succotash with roasted corn, black beans & jicama, red onions, cilantro, cotija cheese, grape tomatoes, avocado with chipotle vinaigrette',
      category: 'soulful salads' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'avocado-quinoa-superfood-ensalada.png',
      price: 13,
    },
    {
      name: 'The Farm Club',
      description:
        "shaved, roasted turkey breast, smashed avocado, nitrate-free Applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom's seeded whole wheat",
      category: 'craveable classics' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'the-farm-club.png',
      price: 12,
    },
    {
      name: 'Crispy Chicken Tenders',
      description: 'with a side of ketchup or vegan ranch',
      category: 'kids' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'crispy-chicken-tenders.png',
      price: 6,
    },
  ];

  beforeAll(async () => {
    await Menu.bulkCreate(menuData);
  });

  it('GET /api/menu/ should retrieve all menu items', async () => {
    const response = await request.get(BASE_URL);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(menuData.length);
  });

  it('GET /api/menu/group?by=category should retrieve menu items grouped by a category', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'category' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(3);

    expect(response.body.menu[0].items.length).toBe(1);
    expect(response.body.menu[1].items.length).toBe(1);
    expect(response.body.menu[2].items.length).toBe(1);
  });

  it('GET /api/menu/group?by=status should retrieve menu items grouped by a status', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'status' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(1);

    expect(response.body.menu[0].items.length).toBe(3);
  });

  it('GET /api/menu/group?by=tag should retrieve menu items grouped by a tag', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'tag' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(1);

    expect(response.body.menu[0].items.length).toBe(3);
    expect(response.body.menu[0].tag).toBeNull();
  });

  it('GET /api/menu/group?by=random should return error on request', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'price' });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('API Validation Error');
  });

  it('GET /api/menu/:id should retrieve menu item by id', async () => {
    let response = await request.get(`${BASE_URL}/1`);
    let item = response.body.item;
    expect(response.status).toBe(200);
    expect(item.id).toBe(1);
    expect(item.name).toBe(menuData[0].name);

    response = await request.get(`${BASE_URL}/2`);
    item = response.body.item;
    expect(response.status).toBe(200);
    expect(item.id).toBe(2);
    expect(item.name).toBe(menuData[1].name);

    response = await request.get(`${BASE_URL}/2000`);
    item = response.body.item;
    expect(response.status).toBe(200);
    expect(item).toBeDefined();
    expect(item).not.toHaveProperty('id');
  });

  it('GET /api/menu/:id should return error on invalid id', async () => {
    await request.get(`${BASE_URL}/invalid`).expect(400);
    await request.get(`${BASE_URL}/132423frev`).expect(400);
  });
});
