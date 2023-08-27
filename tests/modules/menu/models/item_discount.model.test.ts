import { Item, ItemDiscount, Discount } from '@menu/models';

import 'tests/db-setup';

describe('Item Discount Model', () => {
  let discountId: number;
  let itemId: number;

  beforeAll(async () => {
    const discount = await Discount.create({
      value: '30',
      unit: 'percentage',
      minOrderValue: '0',
      maxDiscountAmount: '100',
      validFrom: new Date(),
      validUntil: new Date(),
    });
    discountId = discount.discountId;

    const item = await Item.create({
      name: '1/2 Italian Roast Beef',
      description:
        'shaved roast beef, mozzarella, Chicago-style mild giardiniera, tomatoes, Vidalia onion, shredded romaine, Italian herb & cheese aioli on a toasted sesame roll',
      status: 'active',
      photoUrl: 'BPItalianRoastBeef.jpg',
    });
    itemId = item.itemId;
  });

  beforeEach(async () => {
    await ItemDiscount.destroy({ where: {} });
  });

  it('should create', async () => {
    const data = { discountId, itemId };
    const itemDiscount = await ItemDiscount.create(data);
    expect(itemDiscount).toMatchObject(data);
  });

  it('should fail to create on duplicate item id', async () => {
    const data = { discountId, itemId };

    await ItemDiscount.create(data);
    expect(ItemDiscount.create(data)).rejects.toThrow();
  });

  it('deleting a an item-discount should not delete the discount or item', async () => {
    const data = { discountId, itemId };

    const itemDiscount = await ItemDiscount.create(data);

    await itemDiscount.destroy();

    const retrievedItemDiscount = await ItemDiscount.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemDiscount).toBeNull();
  });

  it('deleting a item should delete item-discount', async () => {
    const discount = await Discount.create({
      value: '50',
      unit: 'percentage',
      minOrderValue: '0',
      maxDiscountAmount: '1000',
      validFrom: new Date(),
      validUntil: new Date(),
    });

    const item = await Item.create({
      name: 'French Lentil & Kale Soup',
      description:
        'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
      status: 'active',
      photoUrl: 'FrenchLentilKale.jpg',
    });

    const data = {
      discountId: discount.discountId,
      itemId: item.itemId,
    };

    await ItemDiscount.create(data);

    await Item.destroy({ where: { itemId: item.itemId } });

    const retrievedItemDiscount = await ItemDiscount.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemDiscount).toBeNull();
  });

  it('deleting an discount should delete item-discount', async () => {
    const discount = await Discount.create({
      value: '50',
      unit: 'amount',
      minOrderValue: '0',
      maxDiscountAmount: '50',
      validFrom: new Date(),
      validUntil: new Date(),
    });

    const item = await Item.create({
      name: 'Chicken Tortilla Soup',
      description:
        'smooth puree of roasted tomato, tomatillo, poblano, jalapeño, garlic, cumin, and corn tortillas, with shredded chicken',
      status: 'active',
      photoUrl: 'ChickenTortilla.jpg',
    });

    const data = {
      discountId: discount.discountId,
      itemId: item.itemId,
    };

    await ItemDiscount.create(data);

    await Discount.destroy({ where: { discountId: discount.discountId } });

    const retrievedItemDiscount = await ItemDiscount.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemDiscount).toBeNull();
  });
});
