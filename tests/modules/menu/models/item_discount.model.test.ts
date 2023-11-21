import { Item, ItemDiscount, Discount } from '@app/modules/menu/models';

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
      sortOrder: 0,
      isOnPublicMenu: true,
      name: 'Chimichurri Steak & Shishito Bowl',
      description:
        'roasted carved steak over ancient grains tossed with caramelized onion jam & chimichurri, baby spinach, roasted shishito peppers with broccolini, tomatoes & red onions, grilled lemon',
      menuStatus: 'active',
      orderStatus: 'available',
      photoUrl: 'ChimichurriSteakBowl.jpg',
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
      sortOrder: 0,
      isOnPublicMenu: true,
      name: 'Grilled Turkey & Cheddar Sandwich',
      description: 'add herb mayo, yellow mustard, or tomato by request',
      menuStatus: 'active',
      orderStatus: 'available',
      photoUrl: 'TurkeyCheddar.jpg',
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
      sortOrder: 0,
      isOnPublicMenu: true,
      name: 'Spicy Curried Couscous',
      description:
        "with roasted cauliflower & carrots with Mendo's signature spice mix",
      menuStatus: 'active',
      orderStatus: 'available',
      photoUrl: 'Couscous.jpg',
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
