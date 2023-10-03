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
    const menu = await menuService.getGroupedMenu();

    if (menu) {
      expect(menu.length).toBe(2);

      const { bowls } = menu;
      expect(bowls.items.length).toBe(2);

      const { kids } = menu;
      expect(kids.items.length).toBe(1);
    } else expect(true).toBe(false);
  });
});
