import { Request } from 'express';
import { Op, QueryTypes } from 'sequelize';

import sequelize from '@App/db';

import {
  Address,
  AuthOTP,
  PhoneNumber,
  ProviderType,
  Role,
  User,
  UserAccount,
  UserAccountStatusType,
  UserIdentity,
  UserRole,
} from '@user/models';

const deleteUser = (userId: number) => User.destroy({ where: { userId } });

const deleteIdentity = (userId: number, provider: ProviderType) =>
  UserIdentity.destroy({ where: { userId, provider } });

const deactivate = (userId: number) =>
  sequelize.transaction(async (transaction) => {
    await UserAccount.update(
      { status: 'inactive' as UserAccountStatusType },
      { where: { userId }, transaction },
    );

    await UserIdentity.destroy({
      where: { userId },
      transaction,
    });
  });

const usersService = {
  getUserData: async (req: Request) => {
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

  getProfile: async (userId: number) => {
    const query = `
      SELECT
        u.first_name as "firstName",
        u.last_name as "lastName",
        jsonb_build_object(
          'address', a.email,
          'isVerified', CASE WHEN a.status = 'active' THEN true ELSE false END
        ) AS "email",
        CASE WHEN a.password IS NOT NULL 
          THEN true 
          ELSE false 
        END AS "hasPassword",
        ARRAY(
          SELECT provider
          FROM ${UserIdentity.tableName} i
          WHERE i.user_id = u.user_id
        ) AS "authProviders",
        ARRAY(
          SELECT r.name
          FROM ${UserRole.tableName} ur
          JOIN ${Role.tableName} r ON ur.role_id = r.role_id
          WHERE ur.user_id = u.user_id
        ) AS "roles",
        jsonb_build_object(
          'phone', pn.phone_number,
          'isVerified', CASE WHEN pn.status = 'active' THEN true ELSE false END
        ) AS "phoneNumber",
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'addressLine1', a.address_line1,
              'addressLine2', COALESCE(a.address_line2, ''),
              'city', a.city,
              'state', a.state,
              'postalCode', a.postal_code
            )
          )
          FROM ${Address.tableName} a
          WHERE a.user_id = u.user_id
        ) AS "addresses"
      FROM
        ${User.tableName} u
      JOIN 
        ${UserAccount.tableName} a ON u.user_id = a.user_id
      LEFT JOIN
        ${PhoneNumber.tableName} pn ON u.user_id = pn.user_id
      WHERE
        u.user_id = ${userId};`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });

    return result.length === 0 ? null : result[0];
  },

  verifyEmail: async (userId: number) =>
    sequelize.transaction(async (transaction) => {
      await AuthOTP.destroy({
        where: { userId, type: 'email' },
        transaction,
      });

      await UserAccount.update(
        { status: 'active' },
        { where: { userId }, transaction },
      );
    }),

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

  updateUser: (
    userId: number,
    firstName: string | undefined,
    lastName: string | undefined,
  ) => {
    const values: Partial<User> = {};

    if (firstName && firstName.trim().length > 0) values.firstName = firstName;
    if (lastName && lastName.trim().length > 0) values.lastName = lastName;

    return User.update(values, { where: { userId } });
  },

  createPassword: (userId: number, password: string) =>
    UserAccount.update(
      { password },
      {
        where: { userId, password: null },
        individualHooks: true,
      },
    ),

  changePassword: async (
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) => {
    const account = await UserAccount.findOne({
      where: { userId, password: { [Op.ne]: null } },
    });

    if (!account || !account.comparePasswords(currentPassword)) return false;

    await UserAccount.update(
      { password: newPassword },
      { where: { userId }, individualHooks: true },
    );

    return true;
  },

  revokeSocialAuthentication: async (
    userId: number,
    provider: ProviderType,
  ) => {
    const account = await UserAccount.findOne({
      where: { userId, password: { [Op.ne]: null } },
      raw: true,
    });

    if (account) {
      await deleteIdentity(userId, provider);
      return { account: true };
    }

    const otherIdentities = await UserIdentity.findAll({
      where: { userId, provider: { [Op.ne]: provider } },
      raw: true,
    });

    if (otherIdentities.length === 0) {
      await deleteUser(userId);
      return { user: true };
    }

    await deleteIdentity(userId, provider);

    return {
      identity: true,
      otherIdentity: otherIdentities[0].provider,
    };
  },

  closeAccount: async (userId: number) => {
    const account = await UserAccount.findOne({
      where: { userId, password: { [Op.ne]: null } },
      raw: true,
    });

    return account ? deactivate(userId) : deleteUser(userId);
  },
};

export default usersService;
