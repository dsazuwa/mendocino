import MenuItem, { MenuCategoryType, MenuStatusType } from '../../src/models/MenuItem';
import '../utils/db-setup';

describe('Menu Item Model', () => {
  it('should have this shape', () => {
    const expectedKeys = [
      'id', 'name', 'description', 'category', 'photoUrl',
      'status', 'price', 'createdAt', 'updatedAt',
    ].sort();
    const keys = Object.keys(MenuItem.getAttributes()).sort();
    expect(keys).toStrictEqual(expectedKeys);
  });

  it('should create item', async () => {
    const data = {
      name: 'Mrs. Goldfarb\'s Unreal Reuben',
      description: 'plant-based corned beef from Unreal Deli, havarti cheese, apple & celery root slaw, housemade bread & butter pickles, smoky thousand island on panini-pressed rye',
      category: 'sandwiches' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'mrs-goldfarbs-unreal-reuben.png',
      price: 9,
    };

    const menuItem = await MenuItem.create(data);
    expect(menuItem.name).toEqual(data.name);

    const fetchedItem = await MenuItem.findByPk(menuItem.id);
    expect(fetchedItem).toBeDefined();
  });

  it('should retrieve item', async () => {
    const data = {
      name: 'A Sandwich Study of Heat',
      description: 'shaved, roasted turkey breast, smoked gouda, smashed avocado, sriracha mayo, housemade jalapeno salsa verde, tomatoes, romaine lettuce on panini-pressed rustic white served with an extra side of jalapeno salsa verde',
      category: 'craveable classics' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'sandwich-study-heat.png',
      price: 10,
    };

    const menuItem = await MenuItem.create(data);

    let item = await MenuItem.findByPk(menuItem.id);
    expect(item).not.toBeNull();
    expect(item!.id).toEqual(menuItem.id);

    item = await MenuItem.findOne({ where: { name: menuItem.name } });
    expect(item).not.toBeNull();
    expect(item!.name).toEqual(menuItem.name);
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

    const menuItem = await MenuItem.create(data);

    const newData = {
      status: 'out of stock' as MenuStatusType,
      price: 12,
    };

    await menuItem.update(newData);

    const updatedItem = await MenuItem.findByPk(menuItem.id);
    expect(updatedItem!.name).toEqual(data.name);
    expect(updatedItem!.status).toEqual(newData.status);
    expect(Math.trunc(updatedItem!.price)).toEqual(newData.price);
  });

  it('should delete item', async () => {
    const data = {
      name: 'Chicken Pesto Caprese',
      description: 'shaved, roasted chicken breast, fresh mozzarella, marinated red peppers, basil pesto, mixed greens, balsamic glaze drizzle on panini-pressed ciabatta',
      category: 'craveable classics' as MenuCategoryType,
      status: 'available' as MenuStatusType,
      photoUrl: 'chicken-pesto-caprese.png',
      price: 10,
    };

    const menuItem = await MenuItem.create(data);
    await menuItem.destroy();

    const deletedUser = await MenuItem.findByPk(menuItem.id);
    expect(deletedUser).toBeNull;
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

    await MenuItem.create(data);

    expect(MenuItem.create(data)).rejects.toThrow();
  });
});