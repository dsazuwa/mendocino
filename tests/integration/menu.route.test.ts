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

  it('should retrieve all menu items', async () => {
    const response = await request.get(BASE_URL);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(menuData.length);
  });

  it('should retrieve menu items grouped by a category', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'category' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(3);

    expect(response.body.menu[0].items.length).toBe(1);
    expect(response.body.menu[1].items.length).toBe(1);
    expect(response.body.menu[2].items.length).toBe(1);
  });

  it('should retrieve menu items grouped by a status', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'status' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('menu');
    expect(response.body.menu).toHaveLength(1);

    expect(response.body.menu[0].items.length).toBe(3);
  });

  it('should return error on request to retrieve menu items grouped by a non permitted field', async () => {
    const response = await request.get(`${BASE_URL}/group`).query({ by: 'price' });
    expect(response.status).toBe(400);
    expect(response.body.message).toEqual('API Validation Error');
  });
});
