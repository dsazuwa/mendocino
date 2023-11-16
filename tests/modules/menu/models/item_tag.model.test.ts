import { Item, ItemTag, Tag } from 'modules/menu/models';

import '../../../db-setup';

describe('Item tag Model', () => {
  let itemId: number;
  let tagId1: number;
  let tagId2: number;

  beforeAll(async () => {
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

    let tag = await Tag.create({ name: 'v', description: 'vegan' });
    tagId1 = tag.tagId;

    tag = await Tag.create({ name: 'm', description: 'milk' });
    tagId2 = tag.tagId;
  });

  beforeEach(async () => {
    await ItemTag.destroy({ where: {} });
  });

  it('should create', async () => {
    const data1 = { itemId, tagId: tagId1 };
    const itemtag = await ItemTag.create(data1);
    expect(itemtag).toMatchObject(data1);

    const data2 = { itemId, tagId: tagId2 };
    const itemTag2 = await ItemTag.create(data2);
    expect(itemTag2).toMatchObject(data2);
  });

  it('should fail to create on duplicate item id and tagId', async () => {
    const data = { itemId, tagId: tagId1 };

    await ItemTag.create(data);
    expect(ItemTag.create(data)).rejects.toThrow();
  });

  it('deleting a an item-tag should not delete the item or tag', async () => {
    const data = { itemId, tagId: tagId1 };

    const itemtag = await ItemTag.create(data);

    await itemtag.destroy();

    const retrievedItemtag = await ItemTag.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedItemtag).toBeNull();
  });

  it('deleting a tag should delete item-tag', async () => {
    const item = await Item.create({
      sortOrder: 0,
      isOnPublicMenu: true,
      name: 'Grilled Turkey & Cheddar Sandwich',
      description: 'add herb mayo, yellow mustard, or tomato by request',
      menuStatus: 'active',
      orderStatus: 'available',
      photoUrl: 'TurkeyCheddar.jpg',
    });

    const tag = await Tag.create({ name: 'vg', description: 'vegetarian' });

    await ItemTag.create({
      itemId: item.itemId,
      tagId: tag.tagId,
    });

    await Tag.destroy({ where: { tagId: tag.tagId } });

    const retrievedItemtag = await ItemTag.findOne({
      where: { itemId: item.itemId, tagId: tag.tagId },
      raw: true,
    });
    expect(retrievedItemtag).toBeNull();
  });

  it('deleting a item should delete item-tag', async () => {
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

    const tag = await Tag.create({ name: 'n', description: 'nuts' });

    await Item.destroy({ where: { itemId: item.itemId } });

    const retrievedItemtag = await ItemTag.findOne({
      where: { itemId: item.itemId, tagId: tag.tagId },
      raw: true,
    });
    expect(retrievedItemtag).toBeNull();
  });
});
