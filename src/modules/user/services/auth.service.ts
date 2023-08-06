import { sign } from 'jsonwebtoken';

import sequelize from '@App/db';

import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';

type JWTProviderType = ProviderType | 'email';

export const createUserIdentityForUser = (
  id: string,
  userId: number,
  status: string,
  providerType: ProviderType,
) =>
  sequelize.transaction(async (transaction) => {
    if (status === 'pending') {
      await UserAccount.update(
        { status: 'active' },
        { where: { userId }, transaction },
      );
    }

    const identity = await UserIdentity.create(
      { id, userId, providerType },
      { transaction },
    );

    return identity;
  });

export const createUserAndUserIdentity = (
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  providerType: ProviderType,
) =>
  sequelize.transaction(async (transaction) => {
    const { userId } = await User.create(
      { firstName, lastName },
      { transaction },
    );

    await UserAccount.create(
      { userId, email, status: 'active' },
      { transaction },
    );

    const identity = await UserIdentity.create(
      { id, userId, providerType },
      { transaction },
    );

    return identity;
  });

const authService = {
  generateJWT: (userId: number, providerType: JWTProviderType) =>
    sign({ userId, providerType }, process.env.JWT_SECRET, {
      expiresIn: '1 day',
    }),

  getUserFromJWTPayload: async (
    providerType: JWTProviderType,
    userId: number,
  ) => {
    switch (providerType) {
      case 'email': {
        const account = await UserAccount.findOne({ where: { userId } });
        return account || undefined;
      }

      default: {
        const identity = await UserIdentity.findOne({
          where: { userId, providerType },
        });

        return identity || undefined;
      }
    }
  },

  getAccount: (email: string) => UserAccount.findOne({ where: { email } }),

  getIdentity: (id: string, providerType: ProviderType) =>
    UserIdentity.findOne({
      where: { id, providerType },
    }),

  createNewIdentity: (
    id: string,
    account: UserAccount | null,
    firstName: string,
    lastName: string,
    email: string,
    providerType: ProviderType,
  ) =>
    account
      ? createUserIdentityForUser(
          id,
          account.userId,
          account.status,
          providerType,
        )
      : createUserAndUserIdentity(id, firstName, lastName, email, providerType),
};

export default authService;
