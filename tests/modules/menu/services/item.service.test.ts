import { Item } from '@menu/models';
import itemsService from '@menu/services/items.service';

import { createMenu, getItem } from 'tests/modules/menu/helper-functions';

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

describe('create menu item', () => {
  beforeEach(async () => {
    await Item.destroy({ where: {} });
  });

  it('should create item', async () => {
    const name = 'Hot Honey Peach & Prosciutto';
    const description =
      'italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula on a toasted sesame roll';
    const category = "chef's creations";
    const prices = [{ size: 'default', price: 13.25 }];
    const photoUrl = 'PeachProsciutto.jpg';
    const status = 'active';

    const itemId = await itemsService.createItem(
      name,
      description,
      category,
      null,
      prices,
      photoUrl,
      status,
    );

    const item = await getItem(itemId);
    expect(item).toMatchObject({
      itemId,
      name,
      description,
      category,
      tags: null,
      prices,
      status,
      photoUrl,
    });
  });

  it('should create item with tags', async () => {
    const name = 'Prosciutto & Chicken';
    const description =
      'italian prosciutto & shaved, roasted chicken breast with fresh mozzarella, crushed honey roasted almonds, basil pesto, balsamic glaze drizzle, tomatoes on panini-pressed ciabatta';
    const category = 'foodie favorites';
    const tags = ['N', 'RGF'];
    const prices = [{ size: 'default', price: 12.65 }];
    const photoUrl = 'ProsciuttoChicken.jpg';
    const status = 'active';

    const itemId = await itemsService.createItem(
      name,
      description,
      category,
      tags,
      prices,
      photoUrl,
      status,
    );

    const item = await getItem(itemId);
    expect(item).toMatchObject({
      itemId,
      name,
      description,
      category,
      tags,
      prices,
      status,
      photoUrl,
    });
  });

  it('should create item with tags and prices', async () => {
    const name = 'Watermelon Street Cart Salad';
    const description =
      'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette';
    const category = 'deli sides';
    const tags = ['GF', 'V'];
    const prices = [
      { size: 'small', price: 2.85 },
      { size: 'medium', price: 4.95 },
      { size: 'large', price: 8.95 },
    ];
    const photoUrl = 'WatermelonStreetCart.jpg';
    const status = 'active';

    const itemId = await itemsService.createItem(
      name,
      description,
      category,
      tags,
      prices,
      photoUrl,
      status,
    );

    const item = await getItem(itemId);
    expect(item).toMatchObject({
      itemId,
      name,
      description,
      category,
      tags,
      status,
      photoUrl,
    });
  });

  it('should fail to create item on duplicate name', async () => {
    const name = 'Hot Honey Peach & Prosciutto';
    const description =
      'italian prosciutto & sliced peaches with fresh mozzarella, crushed honey roasted almonds, Calabrian chili aioli, hot peach honey, arugula on a toasted sesame roll';
    const category = "chef's creations";
    const prices = [{ size: 'default', price: 13.25 }];
    const photoUrl = 'PeachProsciutto.jpg';
    const status = 'active';

    await itemsService.createItem(
      name,
      description,
      category,
      null,
      prices,
      photoUrl,
      status,
    );

    expect(
      itemsService.createItem(
        name,
        description,
        category,
        null,
        prices,
        photoUrl,
        status,
      ),
    ).rejects.toThrow();
  });

  it('should fail to create item if category does not exist', async () => {
    const name = 'Watermelon Street Cart Salad';
    const description =
      'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette';
    const category = 'deli-sides';
    const tags = ['GF', 'V'];
    const prices = [
      { size: 'small', price: 2.85 },
      { size: 'medium', price: 4.95 },
      { size: 'large', price: 8.95 },
    ];
    const photoUrl = 'WatermelonStreetCart.jpg';
    const status = 'active';

    try {
      await itemsService.createItem(
        name,
        description,
        category,
        tags,
        prices,
        photoUrl,
        status,
      );

      expect(false).toBe(true);
    } catch (e) {
      const item = await Item.findOne({ where: { name }, raw: true });
      expect(item).toBeNull();
    }
  });

  it('should fail to create item if tag does not exist', async () => {
    const name = 'Watermelon Street Cart Salad';
    const description =
      'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette';
    const category = 'deli sides';
    const tags = ['GlutenFree', 'Vegan'];
    const prices = [
      { size: 'small', price: 2.85 },
      { size: 'medium', price: 4.95 },
      { size: 'large', price: 8.95 },
    ];
    const photoUrl = 'WatermelonStreetCart.jpg';
    const status = 'active';

    try {
      await itemsService.createItem(
        name,
        description,
        category,
        tags,
        prices,
        photoUrl,
        status,
      );

      expect(false).toBe(true);
    } catch (e) {
      const item = await Item.findOne({ where: { name }, raw: true });
      expect(item).toBeNull();
    }
  });

  it('should fail to create item if size does not exist', async () => {
    const name = 'Watermelon Street Cart Salad';
    const description =
      'watermelon, cucumber, jicama, fresh mint, green onion, chile-lime vinaigrette';
    const category = 'deli sides';
    const tags = ['GF', 'V'];
    const prices = [
      { size: 'smallish', price: 2.85 },
      { size: 'medium', price: 4.95 },
      { size: 'large', price: 8.95 },
    ];
    const photoUrl = 'WatermelonStreetCart.jpg';
    const status = 'active';

    try {
      await itemsService.createItem(
        name,
        description,
        category,
        tags,
        prices,
        photoUrl,
        status,
      );

      expect(false).toBe(true);
    } catch (e) {
      const item = await Item.findOne({ where: { name }, raw: true });
      expect(item).toBeNull();
    }
  });
});
