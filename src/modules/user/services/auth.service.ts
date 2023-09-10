import { QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import {
  AdminAccount,
  AdminOTP,
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  Email,
  ProviderType,
} from '@user/models';

const authService = {
  createIdentityForCustomer: (
    identityId: string,
    customerId: number,
    status: string,
    provider: ProviderType,
  ) =>
    sequelize.transaction(async (transaction) => {
      if (status === 'pending') {
        await Customer.update(
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
        { firstName, lastName, status: 'active' },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerEmail.create({ customerId, emailId }, { transaction });

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
      const { customerId, status } = await Customer.create(
        { firstName, lastName, status: 'pending' },
        { transaction },
      );

      const { emailId } = await Email.create({ email }, { transaction });

      await CustomerEmail.create({ customerId, emailId }, { transaction });

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

      return {
        customerId,
        password: otp,
        user: { firstName, lastName, email, status, roles: ['customer'] },
      };
    }),

  loginUser: async (email: string, password: string) => {
    const query = `
      SELECT
        is_admin AS "isAdmin",
        user_id AS "userId",
        first_name AS "firstName",
        last_name AS "lastName",
        email,
        password AS hashed,
        status,
        roles
      FROM users.get_user_with_password($email);`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { email },
    })) as {
      isAdmin: boolean;
      userId: number;
      firstName: string;
      lastName: string;
      email: string;
      hashed: string;
      status: string;
      roles: string[];
    }[];

    if (result.length === 0) return null;

    const { isAdmin, userId, hashed, ...user } = result[0];

    const isValid = isAdmin
      ? AdminAccount.comparePasswords(password, hashed)
      : CustomerPassword.comparePasswords(password, hashed);

    return isValid ? { isAdmin, userId, user } : null;
  },

  recoverPassword: (isAdmin: boolean, userId: number, password: string) =>
    isAdmin
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
    const result = await Customer.update(
      { status: 'active' },
      { where: { customerId, status: 'deactivated' } },
    );

    return result[0] === 1;
  },
};

export default authService;
