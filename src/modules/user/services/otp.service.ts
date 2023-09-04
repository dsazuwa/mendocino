import sequelize from '@App/db';

import {
  AdminOTP,
  AdminOTPType,
  CustomerOTP,
  CustomerOTPType,
} from '@user/models';

const createAdminOTP = (adminId: number, type: AdminOTPType) =>
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
  });

const createCustomerOTP = (customerId: number, type: CustomerOTPType) =>
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
  });

const otpService = {
  getOTP: async (
    userId: number,
    password: string,
    type:
      | { isAdmin: true; otpType: AdminOTPType }
      | { isAdmin: false; otpType: CustomerOTPType },
  ) => {
    const { isAdmin, otpType } = type;

    const otp = isAdmin
      ? await AdminOTP.findOne({ where: { adminId: userId, type: otpType } })
      : await CustomerOTP.findOne({
          where: { customerId: userId, type: otpType },
        });

    const isValid =
      otp !== null &&
      otp.comparePasswords(password) &&
      otp.expiresAt > new Date();

    return isValid ? { otp, isValid } : { otp: null, isValid };
  },

  createOTP: (
    userId: number,
    type:
      | { isAdmin: true; otpType: AdminOTPType }
      | { isAdmin: false; otpType: CustomerOTPType },
  ) => {
    const { isAdmin, otpType } = type;

    return isAdmin
      ? createAdminOTP(userId, otpType)
      : createCustomerOTP(userId, otpType);
  },
};

export default otpService;
