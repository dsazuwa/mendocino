import { Address, Customer } from '@app/modules/user/models';

import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

const raw = true;

describe('Address Model', () => {
  let customerId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'James',
      'Doe',
      'jamesdoe@gmail.com',
      'jamesD0ePa$$',
      'active',
    );
    customerId = customer.customerId;
  });

  beforeEach(async () => {
    await Address.destroy({ where: {} });
  });

  it('should create address', async () => {
    const data = {
      customerId,
      addressLine1: '1957 Kembery Drive',
      city: 'Roselle',
      state: 'IL',
      zipCode: '60172',
    };

    const address = await Address.create(data);
    expect(address).toMatchObject(data);
  });

  it('should throw error on create if customer has reached address limit', async () => {
    const data = {
      customerId,
      addressLine1: '962 University Drive',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60605',
    };

    const promises = [];
    for (let i = 1; i <= 5; i += 1) promises.push(Address.create(data));
    await Promise.all(promises);

    let count = await Address.count({ where: { customerId } });
    expect(count).toBe(5);

    try {
      await Address.create(data);

      expect(true).toBe(false);
    } catch (e) {
      count = await Address.count({ where: { customerId } });
      expect(count).toBe(5);
    }
  });

  it('should retrieve address', async () => {
    await Address.create({
      customerId,
      addressLine1: '1957 Kembery Drive',
      city: 'Roselle',
      state: 'IL',
      zipCode: '60172',
    });

    const addresses = await Address.findAll({ where: { customerId }, raw });
    expect(addresses.length).toEqual(1);
    expect(addresses[0]).toBeDefined();
  });

  it('should update address', async () => {
    const oldCity = 'Roselle';
    const newCity = 'Rock Island';

    const address = await Address.create({
      customerId,
      addressLine1: '1967 Orchid Road',
      city: oldCity,
      state: 'IL',
      zipCode: '60074',
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
      customerId,
      addressLine1: '1561 Coburn Hollow Road',
      city: 'Peoria',
      state: 'IL',
      zipCode: '61602',
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

  it('should not delete Customer on address delete', async () => {
    const address = await Address.create({
      customerId,
      addressLine1: '4921 Flinderation Road',
      city: 'Arlington Heights',
      state: 'IL',
      zipCode: '60005',
    });

    await address.destroy();

    const customer = await Customer.findByPk(customerId, { raw });
    expect(customer).not.toBeNull();
  });

  it('should delete Address on Customer delete', async () => {
    const address = await Address.create({
      customerId,
      addressLine1: '962 University Drive',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60605',
    });

    await Customer.destroy({ where: { customerId } });

    const retrievedAddress = await Address.findByPk(address.addressId, {
      raw,
    });
    expect(retrievedAddress).toBeNull();
  });
});
