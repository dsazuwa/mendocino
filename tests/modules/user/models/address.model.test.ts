import { Address } from '@app/modules/user/models';

import 'tests/db-setup';

const raw = true;

describe('Address Model', () => {
  beforeEach(async () => {
    await Address.destroy({ where: {} });
  });

  it('should create address', async () => {
    const data = {
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

  it('should retrieve address', async () => {
    await Address.create({
      placeId: '34839083205237',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    const addresses = await Address.findAll({ where: {}, raw });
    expect(addresses.length).toEqual(1);
    expect(addresses[0]).toBeDefined();
  });

  it('should update address', async () => {
    const oldAddress = 'Roselle, IL';
    const newAddress = 'Rock Island, IL';

    const address = await Address.create({
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
      placeId: '7876764778676',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    };

    const address = await Address.create(data);

    await address.destroy();

    const retrievedAddress = await Address.findOne({
      where: { addressId: address.addressId },
      raw,
    });
    expect(retrievedAddress).toBeNull();
  });
});
