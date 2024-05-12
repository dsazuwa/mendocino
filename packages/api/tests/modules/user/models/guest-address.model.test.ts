import { Address, Guest, GuestAddress } from '@app/modules/user/models';

import 'tests/db-setup';

describe('Guest Address Model', () => {
  let guestId: string;

  beforeAll(async () => {
    const guest = await Guest.create();
    guestId = guest.guestId;
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

    const data = { addressId, guestId };

    const address = await GuestAddress.create(data);
    expect(address).toMatchObject(data);
  });

  it('should throw error on create if guest has reached address limit', async () => {
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

    await GuestAddress.bulkCreate(
      result.map(({ addressId }) => ({ guestId, addressId })),
    );

    let count = await GuestAddress.count({ where: { guestId } });
    expect(count).toBe(5);

    try {
      const { addressId } = await Address.create({
        ...data,
        placeId: '48284149729731',
      });

      await GuestAddress.create({ guestId, addressId });

      expect(true).toBe(false);
    } catch (e) {
      count = await GuestAddress.count({ where: { guestId } });
      expect(count).toBe(5);
    }
  });

  it('should not delete Address/Guest on GuestAddress delete', async () => {
    const { addressId } = await Address.create({
      placeId: '84w98472942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    const address = await GuestAddress.create({ guestId, addressId });
    await address.destroy();

    const retrievedAddress = await Address.findByPk(addressId, {
      raw: true,
    });
    expect(retrievedAddress).not.toBeNull();

    const guest = await Guest.findByPk(guestId, { raw: true });
    expect(guest).not.toBeNull();
  });

  it('should delete GuestAddress on Address delete', async () => {
    const address = await Address.create({
      placeId: '84w98427978942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await GuestAddress.create({ guestId, addressId: address.addressId });
    await address.destroy();

    const gAddress = await GuestAddress.findOne({
      where: { guestId },
      raw: true,
    });
    expect(gAddress).toBeNull();
  });

  it('should delete GuestAddress on Guest delete', async () => {
    const { addressId } = await Address.create({
      placeId: '84w98427978942',
      name: '1957 Kembery Drive',
      address: 'Roselle, IL',
      zipCode: '60172',
      lat: '-90',
      lng: '-40',
    });

    await GuestAddress.create({ guestId, addressId });
    await Guest.destroy({ where: { guestId } });

    const address = await GuestAddress.findOne({
      where: { guestId },
      raw: true,
    });
    expect(address).toBeNull();
  });
});
