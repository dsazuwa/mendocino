import { Item, ItemPrice } from 'modules/menu/models';

import '../../../db-setup';

describe('Item Price Model', () => {
  let itemId: number;

  beforeAll(async () => {
    const item = await Item.create({
      sortOrder: 0,
      isOnPublicMenu: true,
      name: 'French Lentil & Kale Soup',
      description:
        'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
      menuStatus: 'active',
      orderStatus: 'available',
      photoUrl: 'FrenchLentilKale.jpg',
    });
    itemId = item.itemId;
  });

  beforeEach(async () => {
    await ItemPrice.destroy({ where: {} });
  });

  it('should create', async () => {
    const data = { itemId, basePrice: '10' };

    const price = await ItemPrice.create(data);
    expect(price.itemId).toBe(data.itemId);
  });

  it('should fail to create on duplicate item id', async () => {
    const data = { itemId, basePrice: '10' };

    await ItemPrice.create(data);
    expect(ItemPrice.create(data)).rejects.toThrow();
  });

  it('deleting a an item price should not delete the item', async () => {
    const data = { itemId, basePrice: '10' };

    const itemPrice = await ItemPrice.create(data);

    await itemPrice.destroy();

    const retrievedItemPrice = await ItemPrice.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemPrice).toBeNull();
  });

  it('deleting an item should delete item price', async () => {
    const item = await Item.create({
      sortOrder: 0,
      isOnPublicMenu: true,
      name: 'Smoky Chicken Elote Bowl',
      description:
        'al pastor chicken smoky corn & guajilo broth, zucchini, ancient grains, shredded cabbage, topped with tortilla strips, crema, cotija, pico de gailo, cilantro, and fresh lime',
      menuStatus: 'active',
      orderStatus: 'available',
      photoUrl: 'SmokyChickenEloteBowl.jpg',
    });

    const data = {
      itemId: item.itemId,
      basePrice: '12.95',
    };

    await ItemPrice.create(data);

    await Item.destroy({ where: { itemId: item.itemId } });

    const retrievedItemPrice = await ItemPrice.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemPrice).toBeNull();
  });
});
