import { QueryTypes } from 'sequelize';

import sequelize from '../../../db';
import { Address } from '../models';

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
      FROM users.customer_addresses a
      WHERE a.customer_id = $id;`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { id: customerId },
    })) as { addresses?: AddressType & { id: number }[] }[];

    const { addresses } = result[0];

    return addresses || [];
  },

  createAddress: (customerId: number, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await Address.count({
        where: { customerId },
        transaction,
      });

      if (addressCount >= 5) return false;

      await Address.create({ customerId, ...address }, { transaction });
      return true;
    }),

  updateAddress: async (
    customerId: number,
    addressId: number,
    address: AddressType,
  ) => {
    const result = await Address.update(address, {
      where: { customerId, addressId },
    });

    return result[0];
  },

  deleteAddress: (customerId: number, addressId: number) =>
    Address.destroy({ where: { customerId, addressId } }),
};

export default addressService;
