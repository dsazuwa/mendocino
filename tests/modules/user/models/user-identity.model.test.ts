import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('User Identity', () => {
  it('should create user udentity', async () => {
    const { userId } = await User.create({
      firstName: 'Jefe',
      lastName: 'Doe',
    });

    const data = {
      identityId: '12243531q39fds24843193402',
      userId,
      provider: 'google' as ProviderType,
    };

    const identity = await UserIdentity.create(data);

    expect(identity.identityId).toBe(data.identityId);
    expect(identity.userId).toBe(data.userId);
    expect(identity.provider).toBe(data.provider);
  });

  it('should retrieve user udentity', async () => {
    const { userId } = await User.create({
      firstName: 'Jorge',
      lastName: 'Doe',
    });

    const { identityId, provider } = await UserIdentity.create({
      identityId: '1239024wqijs013984213',
      userId,
      provider: 'google',
    });

    const retrievedIdentity = await UserIdentity.findOne({
      where: { identityId, userId, provider },
      raw,
    });

    expect(retrievedIdentity).not.toBeNull();
  });

  it('should update user udentity', async () => {
    const { userId } = await User.create({
      firstName: 'Jaime',
      lastName: 'Doe',
    });

    const { identityId, provider } = await UserIdentity.create({
      identityId: '5903837842q81938400',
      userId,
      provider: 'google',
    });

    const newId = '122940897435678';

    await UserIdentity.update(
      { identityId: newId },
      { where: { identityId, userId, provider } },
    );

    const retrievedIdentity = await UserIdentity.findOne({
      where: { provider, userId },
      raw,
    });

    expect(retrievedIdentity).not.toBeNull();
    expect(retrievedIdentity?.identityId).toBe(newId);
  });

  it('should delete user identity', async () => {
    const { userId } = await User.create({
      firstName: 'Julio',
      lastName: 'Doe',
    });

    const { identityId, provider } = await UserIdentity.create({
      identityId: '402847752019382974',
      userId,
      provider: 'google',
    });

    await UserIdentity.destroy({ where: {} });

    const deletedIdentity = await UserIdentity.findOne({
      where: { userId, identityId, provider },
      raw,
    });

    expect(deletedIdentity).toBeNull();
  });
});

describe('User Identity and User Relationship', () => {
  it('deleting User Identity should not delete User', async () => {
    const { userId } = await User.create({
      firstName: 'Jacobo',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'jacobodoe@gmail.com',
    });

    await UserIdentity.create({
      userId,
      identityId: '4289324735691231',
      provider: 'google' as ProviderType,
    });

    await UserIdentity.destroy({ where: { userId } });

    const retrievedIdentity = await UserIdentity.findOne({
      where: { userId },
      raw,
    });
    expect(retrievedIdentity).toBeNull();

    const retrievedUser = await User.findByPk(userId, { raw });
    expect(retrievedUser).not.toBeNull();
  });

  it('deleting User should delete User Identity', async () => {
    const { userId } = await User.create({
      firstName: 'Jairo',
      lastName: 'Doe',
    });

    await UserAccount.create({
      userId,
      email: 'jairodoe@gmail.com',
    });

    await UserIdentity.create({
      userId,
      identityId: '9209324877376132',
      provider: 'google' as ProviderType,
    });

    await User.destroy({ where: { userId } });

    const retrievedIdentity = await UserIdentity.findByPk(userId, { raw });
    expect(retrievedIdentity).toBeNull();
  });
});
