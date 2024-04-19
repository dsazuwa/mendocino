import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';
import { Address, Guest, GuestAddress } from '../models';
import { AddressType } from '../types';

const guestService = {
  getAddresses: async (guestId: string) => {
    const query = `
      SELECT 
        jsonb_agg(jsonb_build_object(
          'id', a.address_id,
          'placeId', a.place_id,
          'suite', a.suite,
          'name', a.name,
          'address', a.address,
          'zipCode', a.zip_code,
          'lat', a.lat,
          'lng', a.lng
        )) AS addresses
      FROM users.addresses a 
      JOIN users.guest_addresses g ON g.address_id = a.address_id
      WHERE g.guest_id = $id;`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { id: guestId },
    })) as { addresses?: AddressType & { id: number }[] }[];

    const { addresses } = result[0];

    return addresses || [];
  },

  createAddress: (guestId: string | undefined, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await GuestAddress.count({
        where: { guestId },
        transaction,
      });

      if (addressCount >= 5) return null;

      const { addressId } = await Address.create(
        { ...address },
        { transaction },
      );

      const id = guestId || (await Guest.create({}, { transaction })).guestId;

      await GuestAddress.create({ guestId: id, addressId }, { transaction });

      return id;
    }),

  updateAddress: async (
    guestId: string,
    addressId: number,
    address: AddressType,
  ) => {
    const guestAddress = await GuestAddress.findOne({
      where: { addressId, guestId },
    });

    if (guestAddress === null) return 0;

    const result = await Address.update(address, {
      where: { addressId },
    });

    return result[0];
  },

  deleteAddress: async (guestId: string, addressId: number) => {
    const guestAddress = await GuestAddress.findOne({
      where: { addressId, guestId },
    });

    if (guestAddress === null) return 0;

    return Address.destroy({ where: { addressId } });
  },
};

export default guestService;
