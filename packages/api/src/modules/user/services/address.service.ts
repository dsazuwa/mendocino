import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';
import { Address, CustomerAddress } from '../models';
import { AddressType } from '../types';

const addressService = {
  getAddresses: async (customerId: number) => {
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
      JOIN users.customer_addresses c ON c.address_id = a.address_id
      WHERE c.customer_id = $id;`;

    return (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { id: customerId },
    })) as AddressType & { id: number }[];
  },

  createAddress: (customerId: number, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await CustomerAddress.count({
        where: { customerId },
        transaction,
      });

      if (addressCount >= 5) return undefined;

      const { addressId } = await Address.create(
        { ...address },
        { transaction },
      );

      await CustomerAddress.create({ customerId, addressId }, { transaction });

      return addressId;
    }),

  updateAddress: async (
    customerId: number,
    addressId: number,
    address: AddressType,
  ) => {
    const customerAddress = await CustomerAddress.findOne({
      where: { addressId, customerId },
    });

    if (customerAddress === null) return 0;

    const result = await Address.update(address, {
      where: { addressId },
    });

    return result[0];
  },

  deleteAddress: async (customerId: number, addressId: number) => {
    const customerAddress = await CustomerAddress.findOne({
      where: { addressId, customerId },
    });

    if (customerAddress === null) return 0;

    return Address.destroy({ where: { addressId } });
  },
};

export default addressService;
