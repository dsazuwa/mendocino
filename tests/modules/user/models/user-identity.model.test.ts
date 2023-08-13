import { ProviderType, User, UserAccount, UserIdentity } from '@user/models';

import 'tests/db-setup';

describe('User Identity', () => {
  it('should create user udentity', async () => {
    const { userId } = await User.create({
      firstName: 'Jefe',
      lastName: 'Doe',
    });

    const data = {
      id: '12243531q39fds24843193402',
      userId,
      providerType: 'google' as ProviderType,
    };

    const identity = await UserIdentity.create(data);

    expect(identity.id).toBe(data.id);
    expect(identity.userId).toBe(data.userId);
    expect(identity.providerType).toBe(data.providerType);
  });

  it('should retrieve user udentity', async () => {
    const { userId } = await User.create({
      firstName: 'Jorge',
      lastName: 'Doe',
    });

    const { id, providerType } = await UserIdentity.create({
      id: '1239024wqijs013984213',
      userId,
      providerType: 'google',
    });

    const retrievedIdentity = await UserIdentity.findOne({
      where: { id, userId, providerType },
    });

    expect(retrievedIdentity).not.toBeNull();
  });

  it('should update user udentity', async () => {
    const { userId } = await User.create({
      firstName: 'Jaime',
      lastName: 'Doe',
    });

    const { id, providerType } = await UserIdentity.create({
      id: '5903837842q81938400',
      userId,
      providerType: 'google',
    });

    const newId = '122940897435678';

    await UserIdentity.update(
      { id: newId },
      { where: { id, userId, providerType } },
    );

    const retrievedIdentity = await UserIdentity.findOne({
      where: { providerType, userId },
    });

    expect(retrievedIdentity).not.toBeNull();
    expect(retrievedIdentity?.id).toBe(newId);
  });

  it('should delete user identity', async () => {
    const { userId } = await User.create({
      firstName: 'Julio',
      lastName: 'Doe',
    });

    const { id, providerType } = await UserIdentity.create({
      id: '402847752019382974',
      userId,
      providerType: 'google',
    });

    await UserIdentity.destroy({ where: {} });

    const deletedIdentity = await UserIdentity.findOne({
      where: { userId, id, providerType },
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
      id: '4289324735691231',
      providerType: 'google' as ProviderType,
    });

    await UserIdentity.destroy({ where: { userId } });

    const retrievedIdentity = await UserIdentity.findOne({ where: { userId } });
    expect(retrievedIdentity).toBeNull();

    const retrievedUser = await User.findByPk(userId);
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
      id: '9209324877376132',
      providerType: 'google' as ProviderType,
    });

    await User.destroy({ where: { userId } });

    const retrievedIdentity = await UserIdentity.findByPk(userId);
    expect(retrievedIdentity).toBeNull();
  });
});
