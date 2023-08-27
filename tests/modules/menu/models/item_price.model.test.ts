import { Item, ItemPrice, Size } from '@menu/models';

import 'tests/db-setup';

describe('Item Price Model', () => {
  let itemId: number;
  let sizeId: number;

  beforeAll(async () => {
    const item = await Item.create({
      name: 'French Lentil & Kale Soup',
      description:
        'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
      status: 'active',
      photoUrl: 'FrenchLentilKale.jpg',
    });
    itemId = item.itemId;

    const size = await Size.create({ name: 'large' });
    sizeId = size.sizeId;
  });

  beforeEach(async () => {
    await ItemPrice.destroy({ where: {} });
  });

  it('should create', async () => {
    const data = { itemId, sizeId, basePrice: '10' };

    const price = await ItemPrice.create(data);
    expect(price.itemId).toBe(data.itemId);
    expect(price.sizeId).toBe(data.sizeId);
  });

  it('should fail to create on duplicate size id', async () => {
    const data = { itemId, sizeId, basePrice: '10' };

    await ItemPrice.create(data);
    expect(ItemPrice.create(data)).rejects.toThrow();
  });

  it('deleting a an item price should not delete the item or size', async () => {
    const data = { itemId, sizeId, basePrice: '10' };

    const itemPrice = await ItemPrice.create(data);

    await itemPrice.destroy();

    const retrievedItemPrice = await ItemPrice.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemPrice).toBeNull();
  });

  it('deleting a size should delete item price', async () => {
    const item = await Item.create({
      name: 'Chicken Tortilla Soup',
      description:
        'smooth puree of roasted tomato, tomatillo, poblano, jalapeño, garlic, cumin, and corn tortillas, with shredded chicken',
      status: 'active',
      photoUrl: 'ChickenTortilla.jpg',
    });

    const size = await Size.create({ name: 'small' });

    const data = {
      itemId: item.itemId,
      sizeId: size.sizeId,
      basePrice: '20',
    };

    await ItemPrice.create(data);

    await Size.destroy({ where: { sizeId: size.sizeId } });

    const retrievedItemPrice = await ItemPrice.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemPrice).toBeNull();
  });

  it('deleting an item should delete item price', async () => {
    const item = await Item.create({
      name: 'Smoky Chicken Elote Bowl',
      description:
        'al pastor chicken smoky corn & guajilo broth, zucchini, ancient grains, shredded cabbage, topped with tortilla strips, crema, cotija, pico de gailo, cilantro, and fresh lime',
      status: 'active',
      photoUrl: 'SmokyChickenEloteBowl.jpg',
    });

    const size = await Size.create({ name: 'medium' });

    const data = {
      itemId: item.itemId,
      sizeId: size.sizeId,
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
