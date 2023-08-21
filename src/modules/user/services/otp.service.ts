import sequelize from '@App/db';

import {
  AdminOTP,
  AdminOTPType,
  CustomerOTP,
  CustomerOTPType,
} from '@user/models';

const otpService = {
  getAdminOTP: async (
    adminId: number,
    type: AdminOTPType,
    password: string,
  ) => {
    const otp = await AdminOTP.findOne({ where: { adminId, type } });

    const isValid =
      otp !== null &&
      otp.comparePasswords(password) &&
      otp.expiresAt > new Date();

    return isValid ? { otp, isValid } : { otp: null, isValid };
  },

  getCustomerOTP: async (
    customerId: number,
    type: CustomerOTPType,
    password: string,
  ) => {
    const otp = await CustomerOTP.findOne({ where: { customerId, type } });

    const isValid =
      otp !== null &&
      otp.comparePasswords(password) &&
      otp.expiresAt > new Date();

    return isValid ? { otp, isValid } : { otp: null, isValid };
  },

  createAdminOTP: async (adminId: number, type: AdminOTPType) =>
    sequelize.transaction(async (transaction) => {
      await AdminOTP.destroy({
        where: { adminId, type },
        transaction,
      });

      const password = '12345';

      await AdminOTP.create(
        {
          adminId,
          type,
          password,
          expiresAt: AdminOTP.getExpiration(),
        },
        { transaction },
      );

      return password;
    }),

  createCustomerOTP: async (customerId: number, type: CustomerOTPType) =>
    sequelize.transaction(async (transaction) => {
      await CustomerOTP.destroy({
        where: { customerId, type },
        transaction,
      });

      const password = '12345';

      await CustomerOTP.create(
        {
          customerId,
          type,
          password,
          expiresAt: CustomerOTP.getExpiration(),
        },
        { transaction },
      );

      return password;
    }),
};

export default otpService;
