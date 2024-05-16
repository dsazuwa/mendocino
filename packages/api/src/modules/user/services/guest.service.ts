import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';
import { Address, Guest, GuestAddress } from '../models';
import { AddressType } from '../types';

const guestService = {
  createGuest: async () => (await Guest.create({})).guestId,

  getAddresses: async (guestId: string) => {
    const query = `
      SELECT 
        a.address_id AS id,
        a.place_id AS "placeId",
        a.suite,
        a.name,
        a.address,
        a.zip_code AS "zipCode",
        a.lat,
        a.lng
      FROM users.addresses a 
      JOIN users.guest_addresses g ON g.address_id = a.address_id
      WHERE g.guest_id = $id;`;

    return (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { id: guestId },
    })) as AddressType & { id: number }[];
  },

  createAddress: (guestId: string | undefined, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await GuestAddress.count({
        where: { guestId },
        transaction,
      });

      if (addressCount >= 5) return undefined;

      const { addressId } = await Address.create(
        { ...address },
        { transaction },
      );

      const id = guestId || (await Guest.create({}, { transaction })).guestId;

      await GuestAddress.create({ guestId: id, addressId }, { transaction });

      return { addressId, guestId: id };
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
