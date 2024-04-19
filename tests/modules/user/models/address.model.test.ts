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
      placeId: '25353232532',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    };

    const address = await Address.create(data);
    expect(address).toMatchObject(data);
  });

  it('should throw error on create if customer has reached address limit', async () => {
    const data = {
      customerId,
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    };

    await Address.bulkCreate(
      Array.from({ length: 5 }, () => ({
        ...data,
        placeId: `${Math.random() * 84728947292}`,
      })),
    );

    let count = await Address.count({ where: { customerId } });
    expect(count).toBe(5);

    try {
      await Address.create({ ...data, placeId: '48284149729731' });

      expect(true).toBe(false);
    } catch (e) {
      count = await Address.count({ where: { customerId } });
      expect(count).toBe(5);
    }
  });

  it('should retrieve address', async () => {
    await Address.create({
      customerId,
      placeId: '34839083205237',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    const addresses = await Address.findAll({ where: { customerId }, raw });
    expect(addresses.length).toEqual(1);
    expect(addresses[0]).toBeDefined();
  });

  it('should update address', async () => {
    const oldAddress = 'Roselle, IL';
    const newAddress = 'Rock Island, IL';

    const address = await Address.create({
      customerId,
      placeId: '932u531985732895',
      name: '1957 Kembery Drive',
      address: oldAddress,
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await address.update({ address: newAddress });

    const retrievedAddress = await Address.findOne({
      where: { addressId: address.addressId },
      raw,
    });
    expect(retrievedAddress).not.toBeNull();
  });

  it('should delete address', async () => {
    const data = {
      customerId,
      placeId: '7876764778676',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
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
      placeId: '84w98472942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await address.destroy();

    const customer = await Customer.findByPk(customerId, { raw });
    expect(customer).not.toBeNull();
  });

  it('should delete Address on Customer delete', async () => {
    const address = await Address.create({
      customerId,
      placeId: '84w98427978942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await Customer.destroy({ where: { customerId } });

    const retrievedAddress = await Address.findByPk(address.addressId, {
      raw,
    });
    expect(retrievedAddress).toBeNull();
  });
});
