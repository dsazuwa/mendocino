import { sign } from 'jsonwebtoken';

import sequelize from '@App/db';

import {
  AdminAccount,
  AdminOTP,
  Customer,
  CustomerAccount,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  Email,
  ProviderType,
} from '@user/models';
import userService from './user.service';

const authService = {
  generateJWT: (email: string, provider: ProviderType | 'email') =>
    sign({ email, provider }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    }),

  createIdentityForCustomer: (
    identityId: string,
    customerId: number,
    status: string,
    provider: ProviderType,
  ) =>
    sequelize.transaction(async (transaction) => {
      if (status === 'pending') {
        await CustomerAccount.update(
          { status: 'active' },
          { where: { customerId }, transaction },
        );
      }

      const identity = await CustomerIdentity.create(
        { identityId, customerId, provider },
        { transaction },
      );

      return identity;
    }),

  createCustomerAndIdentity: (
    identityId: string,
    firstName: string,
    lastName: string,
    email: string,
    provider: ProviderType,
  ) =>
    sequelize.transaction(async (transaction) => {
      const { customerId } = await Customer.create(
        { firstName, lastName },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerAccount.create(
        { customerId, emailId, status: 'active' },
        { transaction },
      );

      const identity = await CustomerIdentity.create(
        { identityId, customerId, provider },
        { transaction },
      );

      return identity;
    }),

  createCustomer: async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) =>
    sequelize.transaction(async (transaction) => {
      const { customerId } = await Customer.create(
        { firstName, lastName },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerAccount.create(
        { customerId, emailId, status: 'pending' },
        { transaction },
      );

      await CustomerPassword.create({ customerId, password }, { transaction });

      await CustomerOTP.destroy({
        where: { customerId, type: 'email' },
        transaction,
      });

      const otp = '12345';

      await CustomerOTP.create(
        {
          customerId,
          type: 'email',
          password: otp,
          expiresAt: CustomerOTP.getExpiration(),
        },
        { transaction },
      );

      return { customerId, password: otp };
    }),

  loginUser: (email: string, password: string) =>
    sequelize.transaction(async (transaction) => {
      const result = await userService.getUserIdForUser(email, transaction);

      if (!result) return null;

      const { isAdmin, userId } = result;

      if (isAdmin) {
        const account = await AdminAccount.findOne({
          where: { adminId: userId },
          transaction,
        });

        const isUser = account !== null && account.comparePasswords(password);

        return isUser
          ? {
              isAdmin,
              userId,
              status: account.status,
            }
          : null;
      }

      const account = await CustomerAccount.findOne({
        where: { customerId: userId },
        raw: true,
        transaction,
      });

      const customerPassword = await CustomerPassword.findOne({
        where: { customerId: userId },
        transaction,
      });

      const isUser =
        account !== null &&
        customerPassword !== null &&
        customerPassword.comparePasswords(password);

      return isUser
        ? {
            isAdmin,
            userId,
            status: account.status,
          }
        : null;
    }),

  recoverPassword: (
    userType: 'admin' | 'customer',
    userId: number,
    password: string,
  ) =>
    userType === 'admin'
      ? sequelize.transaction(async (transaction) => {
          await AdminOTP.destroy({
            where: { adminId: userId, type: 'password' },
            transaction,
          });

          const result = await AdminAccount.update(
            { password },
            {
              where: { adminId: userId },
              individualHooks: true,
              transaction,
            },
          );

          return result[0] === 1;
        })
      : sequelize.transaction(async (transaction) => {
          await CustomerOTP.destroy({
            where: { customerId: userId, type: 'password' },
            transaction,
          });

          const result = await CustomerPassword.update(
            { password },
            {
              where: { customerId: userId },
              individualHooks: true,
              transaction,
            },
          );

          return result[0] === 1;
        }),

  reactivateCustomer: async (customerId: number) => {
    const result = await CustomerAccount.update(
      { status: 'active' },
      { where: { customerId, status: 'deactivated' } },
    );

    return result[0] === 1;
  },
};

export default authService;
