import { Request } from 'express';
import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import {
  Address,
  Customer,
  CustomerAccount,
  CustomerAccountStatusType,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  CustomerPhone,
  Email,
  Phone,
  ProviderType,
} from '@user/models';
import { USER_SCHEMA } from '@user/utils/constants';

const deleteIdentity = (customerId: number, provider: ProviderType) =>
  CustomerIdentity.destroy({ where: { customerId, provider } });

const deactivate = (customerId: number) =>
  sequelize.transaction(async (transaction) => {
    await CustomerAccount.update(
      { status: 'deactivated' as CustomerAccountStatusType },
      { where: { customerId }, transaction },
    );

    await CustomerIdentity.destroy({
      where: { customerId },
      transaction,
    });
  });

const deleteCustomer = async (customerId: number) =>
  sequelize.transaction(async (transaction) => {
    await Address.destroy({ where: { customerId }, transaction });

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

    const account = await CustomerAccount.findOne({
      where: { customerId },
      transaction,
    });
    await Email.destroy({ where: { emailId: account?.emailId }, transaction });
  });

const usersService = {
  getUserDataFromReq: async (req: Request) => {
    const u = req.user;

    return u
      ? {
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          status: u.status,
          roles: u.roles,
        }
      : null;
  },

  getCustomerProfile: async (customerId: number) => {
    const schema = USER_SCHEMA;

    const query = `
      SELECT
        c.first_name as "firstName",
        c.last_name as "lastName",
        jsonb_build_object(
          'address', email.email,
          'isVerified', CASE WHEN account.status = 'active' THEN true ELSE false END
        ) AS "email",
        CASE WHEN c_password.password IS NOT NULL 
          THEN true 
          ELSE false 
        END AS "hasPassword",
        ARRAY(
          SELECT provider
          FROM ${schema}.${CustomerIdentity.tableName} i
          WHERE i.customer_id = c.customer_id
        ) AS "authProviders",
        ARRAY['customer'] AS "roles",
        jsonb_build_object(
          'phone', phone.phone_number,
          'isVerified', CASE WHEN c_phone.status = 'active' THEN true ELSE false END
        ) AS "phoneNumber",
        (
          SELECT 
            jsonb_agg(jsonb_build_object(
              'addressLine1', a.address_line1,
              'addressLine2', COALESCE(a.address_line2, ''),
              'city', a.city,
              'state', a.state,
              'postalCode', a.postal_code
            ))
          FROM ${schema}.${Address.tableName} a
          WHERE a.customer_id = c.customer_id
        ) AS "addresses"
      FROM
        ${schema}.${Customer.tableName} c
      JOIN 
        ${schema}.${CustomerAccount.tableName} account ON account.customer_id = c.customer_id
      JOIN
        ${schema}.${Email.tableName} email ON email.email_id = account.email_id
      LEFT JOIN
        ${schema}.${CustomerPassword.tableName} c_password ON c_password.customer_id = c.customer_id
      LEFT JOIN
        ${schema}.${CustomerPhone.tableName} c_phone ON c_phone.customer_id = c.customer_id
      LEFT JOIN
        ${schema}.${Phone.tableName} phone ON phone.phone_id = c_phone.phone_id
      WHERE
        c.customer_id = ${customerId};`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? null : result[0];
  },

  verifyEmail: async (customerId: number) =>
    sequelize.transaction(async (transaction) => {
      await CustomerOTP.destroy({
        where: { customerId, type: 'email' },
        transaction,
      });

      await CustomerAccount.update(
        { status: 'active' },
        { where: { customerId }, transaction },
      );
    }),

  updateCustomer: async (
    customerId: number,
    firstName: string | undefined,
    lastName: string | undefined,
  ) => {
    const values: Partial<Customer> = {};

    if (firstName && firstName.trim().length > 0) values.firstName = firstName;
    if (lastName && lastName.trim().length > 0) values.lastName = lastName;

    const result = await Customer.update(values, { where: { customerId } });

    return result[0] === 1;
  },

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
      !existingPassword.comparePasswords(currentPassword)
    )
      return false;

    await CustomerPassword.update(
      { password: newPassword },
      { where: { customerId }, individualHooks: true },
    );

    return true;
  },

  revokeSocialAuthentication: async (
    customerId: number,
    provider: ProviderType,
  ) => {
    type QueryReturnType = {
      passwordExists: boolean;
      identityExists: boolean;
      otherIdentities: ProviderType[];
    };

    const schema = USER_SCHEMA;

    const query = `
      SELECT
        c.customer_id AS customerId,
        CASE WHEN cp.customer_id IS NOT NULL THEN TRUE ELSE FALSE END AS "passwordExists",
        ARRAY(
          SELECT provider
          FROM ${schema}.${CustomerIdentity.tableName} i
          WHERE i.customer_id = c.customer_id AND i.provider <> '${provider}'
        ) AS "otherIdentities"
      FROM
        ${schema}.${Customer.tableName} c
      LEFT JOIN
        ${schema}.${CustomerPassword.tableName} cp ON c.customer_id = cp.customer_id
      LEFT JOIN
        ${schema}.${CustomerIdentity.tableName} ci ON c.customer_id = ci.customer_id AND ci.provider = '${provider}'
      WHERE
        c.customer_id = ${customerId};`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    if (result.length === 0) return { result: false };

    const { passwordExists, otherIdentities } = result[0] as QueryReturnType;

    if (passwordExists) {
      await deleteIdentity(customerId, provider);
      return { result: true, switchTo: 'email' };
    }

    if (otherIdentities.length === 0) return { result: false };

    await deleteIdentity(customerId, provider);

    return {
      result: true,
      switchTo: otherIdentities[0],
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

export default usersService;
