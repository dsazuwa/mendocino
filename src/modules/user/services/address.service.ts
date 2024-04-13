import sequelize from '../../../db';
import { Address } from '../models';

type AddressType = {
  addressLine1: string;
  addressLine2: string | undefined;
  city: string;
  state: string;
  zipCode: string;
};

const addressService = {
  getAddresses: (customerId: number) =>
    Address.findAll({
      where: { customerId },
      attributes: ['addressLine1', 'addressLine2', 'city', 'state', 'zipCode'],
      raw: true,
    }),

  createAddress: (customerId: number, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await Address.count({
        where: { customerId },
        transaction,
      });

      if (addressCount <= 4) {
        await Address.create({ customerId, ...address }, { transaction });
        return true;
      }

      return false;
    }),

  updateAddress: async (
    customerId: number,
    addressId: number,
    address: Partial<AddressType>,
  ) => {
    const changes: Partial<AddressType> = {};

    const fieldsToUpdate = [
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'zipCode',
    ] as (keyof Partial<AddressType>)[];

    fieldsToUpdate.forEach((field) => {
      if (address[field]) changes[field] = address[field];
    });

    if (Object.keys(changes).length === 0) return 0;

    const result = await Address.update(changes, {
      where: { customerId, addressId },
    });

    return result[0];
  },

  deleteAddress: (customerId: number, addressId: number) =>
    Address.destroy({ where: { customerId, addressId } }),
};

export default addressService;
