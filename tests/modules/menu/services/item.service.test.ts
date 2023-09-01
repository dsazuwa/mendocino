import itemsService from '@App/modules/menu/services/items.service';

import { createMenu } from 'tests/modules/menu/helper-functions';

import 'tests/db-setup';

beforeAll(async () => {
  await createMenu();
});

describe('get menu items', () => {
  it('should return all menu items', async () => {
    const menu = await itemsService.getMenuItems();

    if (menu) expect(menu.length).toBe(6);
    else expect(true).toBe(false);
  });
});
