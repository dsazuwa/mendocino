import { Address, User } from '@user/models';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from '../helper-functions';

import 'tests/user.db-setup';

const raw = true;

describe('Address Model', () => {
  let userId: number;

  beforeAll(async () => {
    const { user } = await createUserAccount(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'jamesD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );
    userId = user.userId;
  });

  it('should create address', async () => {
    const data = {
      userId,
      addressLine1: '1957 Kembery Drive',
      city: 'Roselle',
      state: 'IL',
      postalCode: '60172',
    };

    const address = await Address.create(data);
    expect(address).toMatchObject(data);
  });

  it('should retrieve address', async () => {
    const addresses = await Address.findAll({ where: { userId }, raw });
    expect(addresses.length).toEqual(1);
    expect(addresses[0]).toBeDefined();
  });

  it('should update address', async () => {
    const oldCity = 'Roselle';
    const newCity = 'Rock Island';

    const address = await Address.create({
      userId,
      addressLine1: '1967 Orchid Road',
      city: oldCity,
      state: 'IL',
      postalCode: '60074',
    });

    await address.update({ city: newCity });

    let retrievedAddress = await Address.findOne({
      where: { addressId: address.addressId },
      raw,
    });
    expect(retrievedAddress).not.toBeNull();

    await Address.update(
      { city: newCity },
      { where: { addressId: address.addressId } },
    );

    retrievedAddress = await Address.findOne({
      where: { addressId: address.addressId },
      raw,
    });
    expect(retrievedAddress).not.toBeNull();
  });

  it('should delete address', async () => {
    const data = {
      userId,
      addressLine1: '1561 Coburn Hollow Road',
      city: 'Peoria',
      state: 'IL',
      postalCode: '61602',
    };

    let address = await Address.create(data);

    await address.destroy();

    let retrievedAddress = await Address.findOne({
      where: { addressId: address.addressId },
      raw,
    });
    expect(retrievedAddress).toBeNull();

    address = await Address.create(data);

    await Address.destroy({ where: { addressId: address.addressId } });

    retrievedAddress = await Address.findOne({
      where: { addressId: address.addressId },
      raw,
    });
    expect(retrievedAddress).toBeNull();
  });

  it('should not delete User on address delete', async () => {
    const address = await Address.create({
      userId,
      addressLine1: '4921 Flinderation Road',
      city: 'Arlington Heights',
      state: 'IL',
      postalCode: '60005',
    });

    await address.destroy();

    const user = await User.findByPk(userId, { raw });
    expect(user).not.toBeNull();
  });

  it('should delete Address on User delete', async () => {
    const address = await Address.create({
      userId,
      addressLine1: '962 University Drive',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60605',
    });

    await User.destroy({ where: { userId } });

    const retrievedAddress = await Address.findByPk(address.addressId, {
      raw,
    });
    expect(retrievedAddress).toBeNull();
  });
});
