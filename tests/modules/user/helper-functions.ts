import {
  ProviderType,
  User,
  UserAccount,
  UserAccountStatusType,
  UserIdentity,
  UserRole,
} from '@App/modules/user/models';

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
  identities: { identityId: string; providerType: ProviderType }[],
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

  const arr: UserIdentity[] = [];

  identities.forEach(async (identity) => {
    const i = await UserIdentity.create({
      userId,
      id: identity.identityId,
      providerType: identity.providerType,
    });

    arr.push(i);
  });

  const promises = roles.map((roleId) => UserRole.create({ userId, roleId }));
  await Promise.all(promises);

  return { userId, user, account, identitities: arr };
};
