import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';
import { Address, CustomerAddress } from '../models';

type AddressType = {
  placeId: string;
  suite?: string;
  name: string;
  address: string;
  zipCode: string;
  lat: string;
  lng: string;
};

const addressService = {
  getAddresses: async (customerId: number) => {
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
      JOIN users.customer_addresses c ON c.address_id = a.address_id
      WHERE c.customer_id = $id;`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { id: customerId },
    })) as { addresses?: AddressType & { id: number }[] }[];

    const { addresses } = result[0];

    return addresses || [];
  },

  createAddress: (customerId: number, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await CustomerAddress.count({
        where: { customerId },
        transaction,
      });

      if (addressCount >= 5) return false;

      const { addressId } = await Address.create(
        { ...address },
        { transaction },
      );

      await CustomerAddress.create({ customerId, addressId }, { transaction });

      return true;
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
