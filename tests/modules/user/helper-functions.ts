import { ROLES } from '@App/modules/user/utils/constants';
import {
  ProviderType,
  User,
  UserAccount,
  UserAccountStatusType,
  UserIdentity,
  UserRole,
} from '@user/models';

export const createUserAccount = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  status: UserAccountStatusType,
  roles: number[],
) => {
  const user = await User.create({ firstName, lastName });

  const { userId } = user;

  const account = await UserAccount.create({
    userId,
    email,
    password,
    status,
  });

  const promises = roles.map((roleId) => UserRole.create({ userId, roleId }));
  await Promise.all(promises);

  return { userId, user, account };
};

export const createUserAccountAndIdentity = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string | null,
  status: UserAccountStatusType,
  identities: { identityId: string; provider: ProviderType }[],
) => {
  const user = await User.create({ firstName, lastName });

  const { userId } = user;

  const account = await UserAccount.create({
    userId,
    email,
    password,
    status,
  });

  const arr: UserIdentity[] = [];

  identities.forEach(async ({ identityId, provider }) => {
    const i = await UserIdentity.create({
      userId,
      identityId,
      provider,
    });

    arr.push(i);
  });

  await UserRole.create({ userId, roleId: ROLES.CUSTOMER.roleId });

  return { userId, user, account, identitities: arr };
};
