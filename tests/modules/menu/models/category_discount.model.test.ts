import { Category, CategoryDiscount, Discount } from '@menu/models';

import 'tests/db-setup';

describe('Category Discount Model', () => {
  let discountId: number;
  let categoryId: number;

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

    const category = await Category.create({ name: 'bowls', sortOrder: 0 });
    categoryId = category.categoryId;
  });

  beforeEach(async () => {
    await CategoryDiscount.destroy({ where: {} });
  });

  it('should create', async () => {
    const data = { discountId, categoryId };
    const categoryDiscount = await CategoryDiscount.create(data);
    expect(categoryDiscount).toMatchObject(data);
  });

  it('should fail to create on duplicate category id', async () => {
    const data = { discountId, categoryId };

    await CategoryDiscount.create(data);
    expect(CategoryDiscount.create(data)).rejects.toThrow();
  });

  it('deleting a an category-discount should not delete the discount or category', async () => {
    const data = { discountId, categoryId };

    const categoryDiscount = await CategoryDiscount.create(data);

    await categoryDiscount.destroy();

    const retrievedCategoryDiscount = await CategoryDiscount.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedCategoryDiscount).toBeNull();
  });

  it('deleting a category should delete category-discount', async () => {
    const discount = await Discount.create({
      value: '50',
      unit: 'percentage',
      minOrderValue: '0',
      maxDiscountAmount: '1000',
      validFrom: new Date(),
      validUntil: new Date(),
    });

    const category = await Category.create({ name: 'kids', sortOrder: 0 });

    const data = {
      discountId: discount.discountId,
      categoryId: category.categoryId,
    };

    await CategoryDiscount.create(data);

    await Category.destroy({ where: { categoryId: category.categoryId } });

    const retrievedCategoryDiscount = await CategoryDiscount.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedCategoryDiscount).toBeNull();
  });

  it('deleting an discount should delete category-discount', async () => {
    const discount = await Discount.create({
      value: '50',
      unit: 'amount',
      minOrderValue: '0',
      maxDiscountAmount: '50',
      validFrom: new Date(),
      validUntil: new Date(),
    });

    const category = await Category.create({
      name: 'deli sides',
      sortOrder: 0,
    });

    const data = {
      discountId: discount.discountId,
      categoryId: category.categoryId,
    };

    await CategoryDiscount.create(data);

    await Discount.destroy({ where: { discountId: discount.discountId } });

    const retrievedCategoryDiscount = await CategoryDiscount.findOne({
      where: data,
      raw: true,
    });
    expect(retrievedCategoryDiscount).toBeNull();
  });
});
