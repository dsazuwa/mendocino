import { Transaction } from 'sequelize';
import sequelize from '../../../db';
import { CustomerOTP, CustomerPhone, Phone } from '../models';

const createPhoneHelper = async (
  customerId: number,
  phoneNumber: string,
  transaction: Transaction,
) => {
  const existingPhone = await Phone.create({ phoneNumber }, { transaction });

  if (existingPhone)
    return { otp: undefined, error: 'Phone number not available' };

  const existingCustomerPhone = await CustomerPhone.findOne({
    where: { customerId },
    transaction,
  });

  if (existingCustomerPhone)
    await Phone.destroy({
      where: { phoneId: existingCustomerPhone.phoneId },
      transaction,
    });

  const { phoneId } = await Phone.create({ phoneNumber }, { transaction });

  await CustomerPhone.create(
    {
      customerId,
      phoneId,
      status: 'pending',
    },
    { transaction },
  );

  const otp = '12345';

  await CustomerOTP.destroy({
    where: { customerId, type: 'phone' },
    transaction,
  });

  await CustomerOTP.create(
    {
      customerId,
      type: 'phone',
      password: otp,
      expiresAt: CustomerOTP.getExpiration(),
    },
    { transaction },
  );

  return { otp, error: undefined };
};

const customerPhoneService = {
  createPhoneHelper,

  createPhone: async (customerId: number, phoneNumber: string) =>
    sequelize.transaction(async (transaction) =>
      createPhoneHelper(customerId, phoneNumber, transaction),
    ),

  verifyPhone: async (customerId: number) =>
    sequelize.transaction(async (transaction) => {
      await CustomerOTP.destroy({
        where: { customerId, type: 'phone' },
        transaction,
      });

      await CustomerPhone.update(
        { status: 'active' },
        { where: { customerId }, transaction },
      );
    }),

  deletePhone: async (customerId: number) =>
    sequelize.transaction(async (transaction) => {
      const userPhone = await CustomerPhone.findOne({
        where: { customerId },
        transaction,
      });

      if (!userPhone) return false;

      await Phone.destroy({
        where: { phoneId: userPhone.phoneId },
        transaction,
      });

      return true;
    }),
};

export default customerPhoneService;
