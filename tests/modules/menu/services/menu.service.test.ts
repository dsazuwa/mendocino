import menuService from '@menu/services/menu.service';

import { createMenu } from 'tests/modules/menu/helper-functions';

import 'tests/db-setup';

beforeAll(async () => {
  await createMenu();
});

describe('get menu', () => {
  it('should return menu items that are either active or sold out', async () => {
    const menu = await menuService.getMenu();

    if (menu) expect(menu.length).toBe(3);
    else expect(true).toBe(false);
  });
});

describe('get menu grouped', () => {
  it('should return menu items that are either active or sold out grouped by category', async () => {
    const menu = await menuService.getMenuGroupedByCategory();

    if (menu) {
      expect(menu.length).toBe(2);

      const bowls = menu.filter((i) => i.category === 'bowls');
      expect(bowls[0].items.length).toBe(2);

      const kids = menu.filter((i) => i.category === 'kids');
      expect(kids[0].items.length).toBe(1);
    } else expect(true).toBe(false);
  });
});
