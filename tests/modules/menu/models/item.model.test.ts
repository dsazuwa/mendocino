import { Item, ItemStatusType } from '@menu/models';

import 'tests/db-setup';

describe('Item Model', () => {
  it('should create item', async () => {
    const data = {
      name: '1/2 Italian Roast Beef',
      description:
        'shaved roast beef, mozzarella, Chicago-style mild giardiniera, tomatoes, Vidalia onion, shredded romaine, Italian herb & cheese aioli on a toasted sesame roll',
      status: 'active' as ItemStatusType,
      photoUrl: 'BPItalianRoastBeef.jpg',
    };

    const item = await Item.create(data);
    expect(item).toMatchObject(data);
  });

  it('should fail to create on duplicate name', async () => {
    const data = {
      name: '1/2 The Farm Club',
      description:
        "shaved, roasted turkey breast, smashed avocado, applewood smoked bacon, herb aioli, tomatoes, mixed greens, pickled red onions on Mom's seeded whole wheat",
      status: 'active' as ItemStatusType,
      photoUrl: 'BPFarmClub.jpg',
    };

    await Item.create(data);
    expect(Item.create(data)).rejects.toThrow();
  });

  it('should retrieve item', async () => {
    const { itemId } = await Item.create({
      name: 'Smoky Chicken Elote Bowl',
      description:
        'al pastor chicken smoky corn & guajilo broth, zucchini, ancient grains, shredded cabbage, topped with tortilla strips, crema, cotija, pico de gailo, cilantro, and fresh lime',
      status: 'active',
      photoUrl: 'SmokyChickenEloteBowl.jpg',
    });

    let retrievedItem = await Item.findByPk(itemId, { raw: true });
    expect(retrievedItem).not.toBeNull();

    retrievedItem = await Item.findOne({ where: { itemId }, raw: true });
    expect(retrievedItem).not.toBeNull();
  });

  it('should update item', async () => {
    const oldName = 'French Lentil & Kale Soup';
    const newName = 'Lentil & Kale Soup';

    const item = await Item.create({
      name: oldName,
      description:
        'french lentils, kale, carrot, celery, onion, herbs, and garlic in a savory vegetable broth',
      status: 'active',
      photoUrl: 'FrenchLentilKale.jpg',
    });

    await item.update({ name: newName });

    let retrievedItem = await Item.findOne({
      where: { name: newName },
      raw: true,
    });
    expect(retrievedItem).not.toBeNull();

    await Item.update({ name: oldName }, { where: { itemId: item.itemId } });

    retrievedItem = await Item.findOne({
      where: { name: oldName },
      raw: true,
    });
    expect(retrievedItem).not.toBeNull();
  });

  it('should delete item', async () => {
    const data = {
      name: 'Chicken Tortilla Soup',
      description:
        'smooth puree of roasted tomato, tomatillo, poblano, jalapeño, garlic, cumin, and corn tortillas, with shredded chicken',
      status: 'active' as ItemStatusType,
      photoUrl: 'ChickenTortilla.jpg',
    };

    let item = await Item.create(data);

    await item.destroy();

    let retrievedItem = await Item.findByPk(item.itemId, { raw: true });
    expect(retrievedItem).toBeNull();

    item = await Item.create(data);

    await Item.destroy({ where: { itemId: item.itemId } });

    retrievedItem = await Item.findByPk(item.itemId, { raw: true });
    expect(retrievedItem).toBeNull();
  });
});
