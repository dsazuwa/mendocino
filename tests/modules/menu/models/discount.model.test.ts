import { Discount, DiscountUnitType } from '@menu/models';

import 'tests/db-setup';

describe('Discount Model', () => {
  it('should create discount', async () => {
    const data = {
      value: '30',
      unit: 'percentage' as DiscountUnitType,
      minOrderValue: '0',
      maxDiscountAmount: '100',
      validFrom: new Date(),
      validUntil: new Date(),
    };

    const discount = await Discount.create(data);
    expect(discount.unit).toBe(data.unit);
  });

  it('should retrieve discount', async () => {
    const { discountId } = await Discount.create({
      value: '100',
      unit: 'amount',
      minOrderValue: '500',
      maxDiscountAmount: '100',
      validFrom: new Date(),
      validUntil: new Date(),
    });

    let retrievedDiscount = await Discount.findByPk(discountId, { raw: true });
    expect(retrievedDiscount).not.toBeNull();

    retrievedDiscount = await Discount.findOne({
      where: { discountId },
      raw: true,
    });
    expect(retrievedDiscount).not.toBeNull();
  });

  it('should update discount', async () => {
    const oldValue = '10';
    const newValue = '25';

    const discount = await Discount.create({
      value: oldValue,
      unit: 'amount',
      minOrderValue: '500',
      maxDiscountAmount: '100',
      validFrom: new Date(),
      validUntil: new Date(),
    });

    await discount.update({ value: newValue });

    let retrievedDiscount = await Discount.findOne({
      where: { discountId: discount.discountId, value: newValue },
      raw: true,
    });
    expect(retrievedDiscount).not.toBeNull();

    await Discount.update(
      { value: oldValue },
      { where: { discountId: discount.discountId } },
    );

    retrievedDiscount = await Discount.findOne({
      where: { discountId: discount.discountId, value: oldValue },
      raw: true,
    });
    expect(retrievedDiscount).not.toBeNull();
  });

  it('should delete discount', async () => {
    const data = {
      value: '15',
      unit: 'percentage' as DiscountUnitType,
      minOrderValue: '0',
      maxDiscountAmount: '200',
      validFrom: new Date(),
      validUntil: new Date(),
    };

    let discount = await Discount.create(data);

    await discount.destroy();

    let retrievedDiscount = await Discount.findByPk(discount.discountId, {
      raw: true,
    });
    expect(retrievedDiscount).toBeNull();

    discount = await Discount.create(data);

    await Discount.destroy({ where: { discountId: discount.discountId } });

    retrievedDiscount = await Discount.findByPk(discount.discountId, {
      raw: true,
    });
    expect(retrievedDiscount).toBeNull();
  });
});
