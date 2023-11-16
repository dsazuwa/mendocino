import sequelize from '../../../db';
import { AdminOTP, AdminPhone, Phone } from '../models';

const adminPhoneService = {
  createPhone: async (adminId: number, phoneNumber: string) =>
    sequelize.transaction(async (transaction) => {
      const existingPhone = await AdminPhone.findOne({
        where: { adminId },
        transaction,
      });

      if (existingPhone)
        await Phone.destroy({
          where: { phoneId: existingPhone.phoneId },
          transaction,
        });

      const { phoneId } = await Phone.create({ phoneNumber }, { transaction });

      await AdminPhone.create(
        {
          adminId,
          phoneId,
          status: 'pending',
        },
        { transaction },
      );

      const otp = '12345';

      await AdminOTP.destroy({
        where: { adminId, type: 'phone' },
        transaction,
      });

      await AdminOTP.create(
        {
          adminId,
          type: 'phone',
          password: otp,
          expiresAt: AdminOTP.getExpiration(),
        },
        { transaction },
      );

      return otp;
    }),

  verifyPhone: async (adminId: number) =>
    sequelize.transaction(async (transaction) => {
      await AdminOTP.destroy({
        where: { adminId, type: 'phone' },
        transaction,
      });

      await AdminPhone.update(
        { status: 'active' },
        { where: { adminId }, transaction },
      );
    }),

  deletePhone: async (adminId: number) =>
    sequelize.transaction(async (transaction) => {
      const userPhone = await AdminPhone.findOne({
        where: { adminId },
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

export default adminPhoneService;
