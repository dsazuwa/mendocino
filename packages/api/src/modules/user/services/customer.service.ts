import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';
import { ProfileFormSchema } from '../middleware/validators/users.validator';
import {
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  CustomerPhone,
  CustomerStatusType,
  Email,
  Phone,
  ProviderType,
} from '../models';
import { JwtProviderType } from '../types';
import { USER_SCHEMA } from '../utils/constants';
import customerPhoneService from './customer-phone.service';

const deleteIdentity = (customerId: number, provider: ProviderType) =>
  CustomerIdentity.destroy({ where: { customerId, provider } });

const deactivate = (customerId: number) =>
  sequelize.transaction(async (transaction) => {
    await Customer.update(
      { status: 'deactivated' as CustomerStatusType },
      { where: { customerId }, transaction },
    );

    await CustomerIdentity.destroy({
      where: { customerId },
      transaction,
    });
  });

const deleteCustomer = async (customerId: number) =>
  sequelize.transaction(async (transaction) => {
    const phone = await CustomerPhone.findOne({
      where: { customerId },
      transaction,
    });
    if (phone)
      await Phone.destroy({
        where: { phoneId: phone.phoneId },
        transaction,
      });

    await CustomerIdentity.destroy({ where: { customerId }, transaction });

    const account = await CustomerEmail.findOne({
      where: { customerId },
      transaction,
    });
    await Email.destroy({ where: { emailId: account?.emailId }, transaction });
  });

const customerService = {
  getProfile: async (customerId: number) => {
    const query = `SELECT * FROM ${USER_SCHEMA}.get_customer_profile($customerId);`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { customerId },
    });

    return result.length === 0
      ? null
      : (result[0] as {
          firstName: string;
          lastName: string;
          phone: { number: string; isVerified: boolean };
          email: { address: string; isVerified: boolean };
          hasPassword: boolean;
          authProviders: ProviderType[];
          addresses: {
            addressLine1: string;
            addressLine2: string;
            city: string;
            state: string;
            zipCode: string;
          }[];
        });
  },

  updateProfile: async (customerId: number, data: ProfileFormSchema) =>
    sequelize.transaction(async (transaction) => {
      const { firstName, lastName, phoneNumber } = data;

      if (firstName || lastName) {
        const values: Partial<Customer> = {};

        if (firstName && firstName.trim().length > 0)
          values.firstName = firstName;

        if (lastName && lastName.trim().length > 0) values.lastName = lastName;

        await Customer.update(values, { where: { customerId } });
      }

      if (phoneNumber) {
        const phoneResult = await customerPhoneService.createPhoneHelper(
          customerId,
          phoneNumber,
          transaction,
        );

        return phoneResult;
      }

      return { otp: undefined, error: undefined };
    }),

  verifyEmail: async (customerId: number) =>
    sequelize.transaction(async (transaction) => {
      await CustomerOTP.destroy({
        where: { customerId, type: 'email' },
        transaction,
      });

      await Customer.update(
        { status: 'active' },
        { where: { customerId }, transaction },
      );
    }),

  createPassword: async (customerId: number, password: string) => {
    const existingPassword = await CustomerPassword.findOne({
      where: { customerId },
      raw: true,
    });

    if (existingPassword) return false;

    await CustomerPassword.create({ customerId, password });
    return true;
  },

  changePassword: async (
    customerId: number,
    currentPassword: string,
    newPassword: string,
  ) => {
    const existingPassword = await CustomerPassword.findOne({
      where: { customerId },
    });

    if (
      !existingPassword ||
      !CustomerPassword.comparePasswords(
        currentPassword,
        existingPassword.password,
      )
    )
      return false;

    const result = await CustomerPassword.update(
      { password: newPassword },
      { where: { customerId }, individualHooks: true },
    );

    return result[0] === 1;
  },

  revokeSocialAuthentication: async (
    customerId: number,
    provider: ProviderType,
  ) => {
    const query = `SELECT * FROM ${USER_SCHEMA}.get_customer_for_revoke_social_auth($customerId, $provider)`;

    const result = await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { customerId, provider },
    });

    if (result.length === 0) return { result: false };

    const { email, passwordExists, otherIdentities } = result[0] as {
      email: string;
      passwordExists: boolean;
      otherIdentities: ProviderType[];
    };

    if (passwordExists) {
      await deleteIdentity(customerId, provider);
      return {
        result: true,
        switchTo: 'email' as JwtProviderType,
        email,
      };
    }

    if (otherIdentities.length === 0) return { result: false };

    await deleteIdentity(customerId, provider);

    return {
      result: true,
      switchTo: otherIdentities[0] as JwtProviderType,
      email,
    };
  },

  closeAccount: async (customerId: number) => {
    const password = await CustomerPassword.findOne({
      where: { customerId },
      raw: true,
    });

    return password ? deactivate(customerId) : deleteCustomer(customerId);
  },
};

export default customerService;
