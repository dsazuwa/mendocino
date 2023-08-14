import { Request } from 'express';
import { Op } from 'sequelize';

import sequelize from '@App/db';

import {
  AuthOTP,
  ProviderType,
  User,
  UserAccount,
  UserAccountStatusType,
  UserIdentity,
} from '@user/models';

const deleteUser = (userId: number) => User.destroy({ where: { userId } });

const deleteIdentity = (userId: number, providerType: ProviderType) =>
  UserIdentity.destroy({ where: { userId, providerType } });

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

  verifyEmail: async (userId: number) =>
    sequelize.transaction(async (transaction) => {
      await AuthOTP.destroy({
        where: { userId, type: 'verify' },
        transaction,
      });

      await UserAccount.update(
        { status: 'active' },
        { where: { userId }, transaction },
      );
    }),

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

  createPassword: (userId: number, password: string) =>
    UserAccount.update(
      { password },
      {
        where: { userId, password: null },
        individualHooks: true,
      },
    ),

  revokeSocialAuthentication: async (
    userId: number,
    providerType: ProviderType,
  ) => {
    const account = await UserAccount.findOne({
      where: { userId, password: { [Op.ne]: null } },
    });

    if (account) {
      await deleteIdentity(userId, providerType);
      return { account: true };
    }

    const otherIdentities = await UserIdentity.findAll({
      where: { userId, providerType: { [Op.ne]: providerType } },
    });

    if (otherIdentities.length === 0) {
      await deleteUser(userId);
      return { user: true };
    }

    await deleteIdentity(userId, providerType);

    return {
      identity: true,
      otherIdentity: otherIdentities[0].providerType,
    };
  },

  closeAccount: async (userId: number) => {
    const account = await UserAccount.findOne({
      where: { userId, password: { [Op.ne]: null } },
    });

    return account ? deactivate(userId) : deleteUser(userId);
  },
};

export default usersService;
