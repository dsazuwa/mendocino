import sequelize from '@App/db';

import { Address } from '@user/models';

type AddressType = {
  addressLine1: string;
  addressLine2: string | undefined;
  city: string;
  state: string;
  postalCode: string;
};

const addressService = {
  getAddresses: (userId: number) =>
    Address.findAll({
      where: { userId },
      attributes: [
        'addressLine1',
        'addressLine2',
        'city',
        'state',
        'postalCode',
      ],
      raw: true,
    }),

  createAddress: (userId: number, address: AddressType) =>
    sequelize.transaction(async (transaction) => {
      const addressCount = await Address.count({
        where: { userId },
        transaction,
      });

      if (addressCount <= 4) {
        await Address.create({ userId, ...address }, { transaction });
        return true;
      }

      return false;
    }),

  updateAddress: async (
    userId: number,
    addressId: number,
    address: Partial<AddressType>,
  ) => {
    const changes: Partial<AddressType> = {};

    const fieldsToUpdate = [
      'addressLine1',
      'addressLine2',
      'city',
      'state',
      'postalCode',
    ] as (keyof Partial<AddressType>)[];

    fieldsToUpdate.forEach((field) => {
      if (address[field]) changes[field] = address[field];
    });

    if (Object.keys(changes).length === 0) return 0;

    const result = await Address.update(changes, {
      where: { userId, addressId },
    });

    return result[0];
  },

  deleteAddress: (userId: number, addressId: number) =>
    Address.destroy({ where: { userId, addressId } }),
};

export default addressService;
