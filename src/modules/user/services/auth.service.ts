import { sign } from 'jsonwebtoken';

import sequelize from '@App/db';

import {
  AdminAccount,
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

      if (result.isAdmin) {
        const adminId = result.userId;

        const account = await AdminAccount.findOne({
          where: { adminId },
          transaction,
        });

        const isUser = account !== null && account.comparePasswords(password);
        return isUser ? adminId : null;
      }

      const customerId = result.userId;

      const account = await CustomerAccount.findOne({
        where: { customerId },
        raw: true,
        transaction,
      });

      const customerPassword = await CustomerPassword.findOne({
        where: { customerId },
        transaction,
      });

      const isUser =
        account !== null &&
        customerPassword !== null &&
        customerPassword.comparePasswords(password);

      return isUser ? customerId : null;
    }),

  recoverCustomerPassword: (customerId: number, password: string) =>
    sequelize.transaction(async (transaction) => {
      await CustomerOTP.destroy({
        where: { customerId, type: 'password' },
        transaction,
      });

      await CustomerPassword.update(
        { password },
        {
          where: { customerId },
          individualHooks: true,
          transaction,
        },
      );
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
