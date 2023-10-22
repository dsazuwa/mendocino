import menuService from '@menu/services/menu.service';

import { createMenu } from 'tests/modules/menu/helper-functions';

import 'tests/db-setup';

beforeAll(async () => {
  await createMenu();
});

// describe('get menu', () => {
//   it('should return menu items that are either active or sold out', async () => {
//     try {
//       const menu = await menuService.getMenu();

//       if (menu) expect(menu.length).toBe(3);
//       else expect(true).toBe(false);
//     } catch (e) {
//       console.log(e);
//     }
//   });
// });

describe('get menu grouped', () => {
  it('should return menu items that are either active or sold out grouped by category', async () => {
    const { categories, menu } = await menuService.getGroupedMenu();

    expect(categories).toStrictEqual([
      "chef's creations",
      'foodie favorites',
      'bowls',
      'kids',
    ]);

    const [chef, foodie, bowls, kids] = menu;

    expect(chef.category).toBe("chef's creations");
    expect(chef.items).toHaveLength(2);

    expect(foodie.category).toBe('foodie favorites');
    expect(foodie.items).toHaveLength(1);

    expect(bowls.category).toBe('bowls');
    expect(bowls.items).toHaveLength(2);

    expect(kids.category).toBe('kids');
    expect(kids.items).toHaveLength(1);
  });
});
