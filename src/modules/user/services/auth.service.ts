import { sign } from 'jsonwebtoken';

import { ProviderType, UserAccount, UserIdentity } from '@user/models';

type JWTProviderType = ProviderType | 'email';

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
};

export default authService;
