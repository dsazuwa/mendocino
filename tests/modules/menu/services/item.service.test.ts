import { Category, Item, ItemCategory } from '@menu/models';
import itemsService from '@menu/services/items.service';

import {
  createItem,
  createMenu,
  getItem,
} from 'tests/modules/menu/helper-functions';

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
    const prices = [{ size: 'base', price: 13.25 }];
    const photoUrl = 'PeachProsciutto.jpg';
    const status = 'active';

    const itemId = await itemsService.createItem(
      name,
      description,
      category,
      undefined,
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
    const prices = [{ size: 'base', price: 12.65 }];
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
    const prices = [{ size: 'base', price: 13.25 }];
    const photoUrl = 'PeachProsciutto.jpg';
    const status = 'active';

    await itemsService.createItem(
      name,
      description,
      category,
      undefined,
      prices,
      photoUrl,
      status,
    );

    expect(
      itemsService.createItem(
        name,
        description,
        category,
        undefined,
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

describe('update menu item', () => {
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

  it('should update name', async () => {
    const name = 'Prosciutto and Chicken';

    await itemsService.updateItem(
      itemId,
      name,
      undefined,
      undefined,
      undefined,
      undefined,
    );

    const item = await Item.findOne({ where: { itemId, name }, raw: true });
    expect(item).not.toBeNull();
  });

  it('should update category', async () => {
    const category = 'bowls';

    await itemsService.updateItem(
      itemId,
      undefined,
      undefined,
      category,
      undefined,
      undefined,
    );

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

  it('should throw error on invalid category', async () => {
    const category = 'foodies';

    const c = await Category.findOne({
      where: { name: category },
      raw: true,
    });
    expect(c).toBeNull();

    expect(
      itemsService.updateItem(
        itemId,
        undefined,
        undefined,
        category,
        undefined,
        undefined,
      ),
    ).rejects.toThrowError();
  });
});

describe('update menu item', () => {
  let categoryId: number;

  beforeEach(async () => {
    await Item.destroy({ where: {} });

    const category = await Category.findOne({
      where: { name: 'foodie favorites' },
      raw: true,
    });
    categoryId = category?.categoryId || -1;
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

    await itemsService.updateItemStatus(itemId, status);

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

    await itemsService.updateItemStatus(itemId, status);

    const item = await Item.findOne({ where: { itemId, status }, raw: true });
    expect(item).not.toBeNull();
  });
});

describe('delete menu item', () => {
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

    const result = await itemsService.deleteItem(itemId);
    expect(result).toBe(true);

    const item = await Item.findOne({ where: { itemId }, raw: true });
    expect(item).toBeNull();
  });

  it('should fail to delete if item does not exist', async () => {
    const result = await itemsService.deleteItem(-1);
    expect(result).toBe(false);
  });
});
