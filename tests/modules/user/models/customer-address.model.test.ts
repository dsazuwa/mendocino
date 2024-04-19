import { Address, Customer, CustomerAddress } from '@app/modules/user/models';

import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

describe('Customer Address Model', () => {
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
    const { addressId } = await Address.create({
      placeId: '25353232532',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    const data = { addressId, customerId };

    const address = await CustomerAddress.create(data);
    expect(address).toMatchObject(data);
  });

  it('should throw error on create if customer has reached address limit', async () => {
    const data = {
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    };

    const result = await Address.bulkCreate(
      Array.from({ length: 5 }, () => ({
        ...data,
        placeId: `${Math.random() * 84728947292}`,
      })),
    );

    await CustomerAddress.bulkCreate(
      result.map(({ addressId }) => ({ customerId, addressId })),
    );

    let count = await CustomerAddress.count({ where: { customerId } });
    expect(count).toBe(5);

    try {
      const { addressId } = await Address.create({
        ...data,
        placeId: '48284149729731',
      });

      await CustomerAddress.create({ customerId, addressId });

      expect(true).toBe(false);
    } catch (e) {
      count = await CustomerAddress.count({ where: { customerId } });
      expect(count).toBe(5);
    }
  });

  it('should not delete Address/Customer on CustomerAddress delete', async () => {
    const { addressId } = await Address.create({
      placeId: '84w98472942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    const address = await CustomerAddress.create({ customerId, addressId });
    await address.destroy();

    const retrievedAddress = await Address.findByPk(addressId, {
      raw: true,
    });
    expect(retrievedAddress).not.toBeNull();

    const customer = await Customer.findByPk(customerId, { raw: true });
    expect(customer).not.toBeNull();
  });

  it('should delete CustomerAddress on Address delete', async () => {
    const address = await Address.create({
      placeId: '84w98427978942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await CustomerAddress.create({ customerId, addressId: address.addressId });
    await address.destroy();

    const cAddress = await CustomerAddress.findOne({
      where: { customerId },
      raw: true,
    });
    expect(cAddress).toBeNull();
  });

  it('should delete CustomerAddress on Customer delete', async () => {
    const { addressId } = await Address.create({
      placeId: '84w98427978942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await CustomerAddress.create({ customerId, addressId });
    await Customer.destroy({ where: { customerId } });

    const address = await CustomerAddress.findOne({
      where: { customerId },
      raw: true,
    });
    expect(address).toBeNull();
  });
});
