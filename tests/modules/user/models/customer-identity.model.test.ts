import {
  ProviderType,
  Customer,
  CustomerAccount,
  CustomerIdentity,
  Email,
} from '@user/models';

import 'tests/db-setup';

const raw = true;

describe('Customer Identity', () => {
  it('should create user udentity', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jefe',
      lastName: 'Doe',
    });

    const data = {
      identityId: '12243531q39fds24843193402',
      customerId,
      provider: 'google' as ProviderType,
    };

    const identity = await CustomerIdentity.create(data);

    expect(identity).toMatchObject(data);
  });

  it('should retrieve user udentity', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jorge',
      lastName: 'Doe',
    });

    const { identityId, provider } = await CustomerIdentity.create({
      identityId: '1239024wqijs013984213',
      customerId,
      provider: 'google',
    });

    const retrievedIdentity = await CustomerIdentity.findOne({
      where: { identityId, customerId, provider },
      raw,
    });

    expect(retrievedIdentity).not.toBeNull();
  });

  it('should update user udentity', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jaime',
      lastName: 'Doe',
    });

    const { identityId, provider } = await CustomerIdentity.create({
      identityId: '5903837842q81938400',
      customerId,
      provider: 'google',
    });

    const newId = '122940897435678';

    await CustomerIdentity.update(
      { identityId: newId },
      { where: { identityId, customerId, provider } },
    );

    const retrievedIdentity = await CustomerIdentity.findOne({
      where: { provider, customerId, identityId: newId },
      raw,
    });
    expect(retrievedIdentity).not.toBeNull();
  });

  it('should delete user identity', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Julio',
      lastName: 'Doe',
    });

    const { identityId, provider } = await CustomerIdentity.create({
      identityId: '402847752019382974',
      customerId,
      provider: 'google',
    });

    await CustomerIdentity.destroy({ where: {} });

    const deletedIdentity = await CustomerIdentity.findOne({
      where: { customerId, identityId, provider },
      raw,
    });

    expect(deletedIdentity).toBeNull();
  });
});

describe('Customer Identity and Customer Relationship', () => {
  it('deleting CustomerIdentity should not delete Customer', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jacobo',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jacobodoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerIdentity.create({
      customerId,
      identityId: '4289324735691231',
      provider: 'google' as ProviderType,
    });

    await CustomerIdentity.destroy({ where: { customerId } });

    const retrievedIdentity = await CustomerIdentity.findOne({
      where: { customerId },
      raw,
    });
    expect(retrievedIdentity).toBeNull();

    const retrievedUser = await Customer.findByPk(customerId, { raw });
    expect(retrievedUser).not.toBeNull();
  });

  it('deleting Customer should delete CustomerIdentity', async () => {
    const { customerId } = await Customer.create({
      firstName: 'Jairo',
      lastName: 'Doe',
    });

    const { emailId } = await Email.create({ email: 'jairodoe@gmail.com' });

    await CustomerAccount.create({
      customerId,
      emailId,
      status: 'active',
    });

    await CustomerIdentity.create({
      customerId,
      identityId: '9209324877376132',
      provider: 'google' as ProviderType,
    });

    await Customer.destroy({ where: { customerId } });

    const retrievedIdentity = await CustomerIdentity.findOne({
      where: { customerId, provider: 'google' },
      raw,
    });
    expect(retrievedIdentity).toBeNull();
  });
});
