import sequelize from '@App/db';

import { AuthOTP, PhoneNumber } from '@user/models';

const phonesService = {
  createPhone: async (userId: number, phoneNumber: string) =>
    sequelize.transaction(async (transaction) => {
      await PhoneNumber.destroy({ where: { userId }, transaction });

      await PhoneNumber.create(
        {
          userId,
          phoneNumber,
          status: 'pending',
        },
        { transaction },
      );

      const otp = '12345';

      await AuthOTP.destroy({
        where: { userId, type: 'phone' },
        transaction,
      });

      await AuthOTP.create(
        {
          userId,
          type: 'phone',
          password: otp,
          expiresAt: AuthOTP.getExpiration(),
        },
        { transaction },
      );

      return otp;
    }),

  verifyPhone: async (userId: number) =>
    sequelize.transaction(async (transaction) => {
      await AuthOTP.destroy({
        where: { userId, type: 'phone' },
        transaction,
      });

      await PhoneNumber.update(
        { status: 'active' },
        { where: { userId }, transaction },
      );
    }),

  deletePhone: async (userId: number) =>
    PhoneNumber.destroy({ where: { userId } }),
};

export default phonesService;
