import { Menu, MenuCategoryType, MenuStatusType, MenuMenuTag, MenuTag } from '../../src/models/Menu';
import '../utils/db-setup';

describe('Menu Model', () => {
  it('should have this shape', () => {
    const expectedKeys = [
      'id',
      'name',
      'description',
      'category',
      'photoUrl',
      'status',
      'price',
      'createdAt',
      'updatedAt',
    ].sort();
    const keys = Object.keys(Menu.getAttributes()).sort();
    expect(keys).toStrictEqual(expectedKeys);
  });

  it('should create item', async () => {
    const data = {
      name: "Mrs. Goldfarb's Unreal Reuben",
      description:
        'plant-based corned beef from Unreal Deli, havarti cheese, apple & celery root slaw, housemade bread & butter pickles, smoky thousand island on panini-pressed rye',
      category: 'sandwiches' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'mrs-goldfarbs-unreal-reuben.png',
      price: 9,
    };

    const menuItem = await Menu.create(data);
    expect(menuItem.name).toEqual(data.name);

    const fetchedItem = await Menu.findByPk(menuItem.id);
    expect(fetchedItem).not.toBeNull();
  });

  it('should retrieve item', async () => {
    const data = {
      name: 'A Sandwich Study of Heat',
      description:
        'shaved, roasted turkey breast, smoked gouda, smashed avocado, sriracha mayo, housemade jalapeno salsa verde, tomatoes, romaine lettuce on panini-pressed rustic white served with an extra side of jalapeno salsa verde',
      category: 'craveable classics' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'sandwich-study-heat.png',
      price: 10,
    };

    const menuItem = await Menu.create(data);

    let item = await Menu.findByPk(menuItem.id);
    expect(item).not.toBeNull();

    item = await Menu.findOne({ where: { name: menuItem.name } });
    expect(item).not.toBeNull();
  });

  it('should update item', async () => {
    const data = {
      name: 'Cheddar Cheese Quesadilla',
      description: 'melted cheddar cheese on a whole wheat tortilla',
      category: 'kids' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'scheddar-cheese-quesadilla.png',
      price: 10,
    };

    const menuItem = await Menu.create(data);

    const newData = {
      status: 'out of stock' as MenuStatusType,
      price: 12,
    };

    await menuItem.update(newData);

    const updatedItem = await Menu.findByPk(menuItem.id);
    expect(updatedItem!.id).toEqual(menuItem.id);
    expect(updatedItem!.status).toEqual(newData.status);
    expect(Math.trunc(updatedItem!.price)).toEqual(newData.price);
  });

  it('should delete item', async () => {
    const data = {
      name: 'Chicken Pesto Caprese',
      description:
        'shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta',
      category: 'craveable classics' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'chicken-pesto-caprese.png',
      price: 10,
    };

    const menuItem = await Menu.create(data);
    await menuItem.destroy();

    const deletedUser = await Menu.findByPk(menuItem.id);
    expect(deletedUser).toBeNull();
  });

  it('should fail on duplicate', async () => {
    const data = {
      name: 'Almond Romesco Shells',
      description: 'pasta shells with romesco, almonds, roasted red peppers, parmesan, and baby spinach',
      category: 'deli sides' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'almond-romesco-shells.png',
      price: 10,
    };

    await Menu.create(data);
    expect(Menu.create(data)).rejects.toThrow();
  });
});

describe('Menu Tag Model', () => {
  it('should have this shape', () => {
    const expectedKeys = ['id', 'name', 'createdAt', 'updatedAt'].sort();
    const keys = Object.keys(MenuTag.getAttributes()).sort();
    expect(keys).toStrictEqual(expectedKeys);
  });

  it('should create tag', async () => {
    const data = { name: 'VG' };

    const tag = await MenuTag.create(data);
    expect(tag.name).toEqual(data.name);

    const fetchedTag = await MenuTag.findByPk(tag.id);
    expect(fetchedTag).not.toBeNull();
  });

  it('should retrieve tag', async () => {
    const data = { name: 'N' };

    const tag = await MenuTag.create(data);

    let fetchedTag = await MenuTag.findByPk(tag.id);
    expect(fetchedTag).not.toBeNull();

    fetchedTag = await MenuTag.findOne({ where: { name: tag.name } });
    expect(fetchedTag).not.toBeNull();
  });

  it('should update tag', async () => {
    const data = { name: 'FG' };

    const tag = await MenuTag.create(data);

    const newData = { name: 'GF' };
    await tag.update(newData);

    const updatedTag = await MenuTag.findByPk(tag.id);
    expect(updatedTag!.name).toBe(newData.name);
  });

  it('should destroy tag', async () => {
    const data = { name: 'RGF' };

    const tag = await MenuTag.create(data);
    await tag.destroy();

    const deletedTag = await MenuTag.findByPk(tag.id);
    expect(deletedTag).toBeNull();
  });
});

describe('MenuItem and MenuTag Relationship', () => {
  let vegan: MenuTag, milk: MenuTag, seaFood: MenuTag;
  let menuItem: Menu;

  beforeAll(async () => {
    vegan = await MenuTag.create({ name: 'V' });
    milk = await MenuTag.create({ name: 'M' });
    seaFood = await MenuTag.create({ name: 'SF' });

    menuItem = await Menu.create({
      name: 'The Modern Caesar',
      description:
        'curly kale, chopped romaine, housemade superfood krunchies, shaved Grana Padano cheese, red onions, grape tomatoes, avocado, lemon squeeze with classic Caesar dressing',
      category: 'salads' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'modern-caesar.png',
      price: 8,
    });
  });

  describe('Create, Retrieve, Remove Association', () => {
    it('should associate a MenuTag with a MenuItem', async () => {
      await menuItem.addMenuTag(vegan);
      const tag = await MenuMenuTag.findOne({ where: { menuId: menuItem.id } });
      expect(tag).not.toBeNull();
      expect(tag!.menuTagId).toEqual(vegan.id);

      await menuItem.addMenuTags([milk, seaFood]);
      const tags = await MenuMenuTag.findAll({ where: { menuId: menuItem.id } });
      expect(tags.length).toEqual(3);
      expect(tags[1].menuTagId).toEqual(milk.id);
      expect(tags[2].menuTagId).toEqual(seaFood.id);
    });

    it('should get MenuTags associated with a MenuItem', async () => {
      const tags = await menuItem.getMenuTags();
      expect(tags.length).toEqual(3);
      expect(tags[0].id).toEqual(vegan.id);
      expect(tags[1].id).toEqual(milk.id);
      expect(tags[2].id).toEqual(seaFood.id);
    });

    it('should remove association between a MenuTag and MenuItem', async () => {
      await menuItem.removeMenuTag(seaFood);
      let tags = await MenuMenuTag.findAll({ where: { menuId: menuItem.id } });
      expect(tags.length).toEqual(2);

      await menuItem.removeMenuTags([milk, vegan]);
      tags = await MenuMenuTag.findAll({ where: { menuId: menuItem.id } });
      expect(tags.length).toEqual(0);
    });
  });

  describe('Deleting MenuTag/MenuItem effect', () => {
    it('deleting MenuTag should remove associations', async () => {
      await menuItem.addMenuTags([vegan, milk, seaFood]);
      await seaFood.destroy();
      const association = await MenuMenuTag.findOne({ where: { menuTagId: seaFood.id } });
      expect(association).toBeNull();
    });

    it('deleting MenuItem should remove associations', async () => {
      await menuItem.destroy();
      const associations = await MenuMenuTag.findAll({ where: { menuId: menuItem.id } });
      expect(associations.length).toEqual(0);
    });
  });
});
