import { Category, Item, ItemCategory } from '@menu/models';

import 'tests/db-setup';

describe('Item Category Model', () => {
  let itemId: number;
  let categoryId: number;

  beforeAll(async () => {
    const item = await Item.create({
      name: 'Chimichurri Steak & Shishito Bowl',
      description:
        'roasted carved steak over ancient grains tossed with caramelized onion jam & chimichurri, baby spinach, roasted shishito peppers with broccolini, tomatoes & red onions, grilled lemon',
      status: 'active',
      photoUrl: 'ChimichurriSteakBowl.jpg',
    });
    itemId = item.itemId;

    const category = await Category.create({ name: 'bowls' });
    categoryId = category.categoryId;
  });

  beforeEach(async () => {
    await ItemCategory.destroy({ where: {} });
  });

  it('should create', async () => {
    const itemCategory = await ItemCategory.create({ itemId, categoryId });
    expect(itemCategory).toMatchObject({ itemId, categoryId });
  });

  it('should fail to create on duplicate item id', async () => {
    await ItemCategory.create({ itemId, categoryId });
    expect(ItemCategory.create({ itemId, categoryId })).rejects.toThrow();
  });

  it('deleting a an item-category should not delete the item or category', async () => {
    const itemCategory = await ItemCategory.create({ itemId, categoryId });

    await itemCategory.destroy();

    const retrievedItemCategory = await ItemCategory.findOne({
      where: { itemId, categoryId },
      raw: true,
    });
    expect(retrievedItemCategory).toBeNull();
  });

  it('deleting a category should delete item-category', async () => {
    const item = await Item.create({
      name: 'Grilled Turkey & Cheddar Sandwich',
      description: 'add herb mayo, yellow mustard, or tomato by request',
      status: 'active',
      photoUrl: 'TurkeyCheddar.jpg',
    });

    const category = await Category.create({ name: 'kids' });

    await ItemCategory.create({
      itemId: item.itemId,
      categoryId: category.categoryId,
    });

    await Category.destroy({ where: { categoryId: category.categoryId } });

    const retrievedItemCategory = await ItemCategory.findOne({
      where: { itemId: item.itemId, categoryId: category.categoryId },
      raw: true,
    });
    expect(retrievedItemCategory).toBeNull();
  });

  it('deleting an item should delete item-category', async () => {
    const item = await Item.create({
      name: 'Spicy Curried Couscous',
      description:
        "with roasted cauliflower & carrots with Mendo's signature spice mix",
      status: 'active',
      photoUrl: 'Couscous.jpg',
    });

    const category = await Category.create({ name: 'deli sides' });

    await Item.destroy({ where: { itemId: item.itemId } });

    const retrievedItemCategory = await ItemCategory.findOne({
      where: { itemId: item.itemId, categoryId: category.categoryId },
      raw: true,
    });
    expect(retrievedItemCategory).toBeNull();
  });
});
