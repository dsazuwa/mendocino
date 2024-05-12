import { Address, CustomerAddress } from '@app/modules/user/models';
import { addressService } from '@app/modules/user/services';

import { createCustomer } from '../helper-functions';

import 'tests/db-setup';

describe('address management', () => {
  let customerId: number;

  beforeAll(async () => {
    const { customer } = await createCustomer(
      'Jimmy',
      'Doe',
      'jimmydoe@gmail.com',
      'jimmyD0ePa$$',
      'active',
    );
    customerId = customer.customerId;
  });

  beforeEach(async () => {
    await Address.destroy({ where: {} });
  });

  describe('get addresses', () => {
    it('should get all addresses for user', async () => {
      const result = await Address.bulkCreate(
        Array.from({ length: 3 }, () => ({
          placeId: `${Math.random() * 84728947292}`,
          name: '1957 Kembery Drive',
          address: 'Roselle, IL',
        })),
      );

      await CustomerAddress.bulkCreate(
        result.map(({ addressId }) => ({ customerId, addressId })),
      );

      const addresses = await addressService.getAddresses(customerId);
      expect(addresses.length).toBe(3);
    });

    it('should return empty array for non existent user', async () => {
      const addresses = await addressService.getAddresses(1000);
      expect(addresses).toStrictEqual([]);
    });
  });

  describe('create address', () => {
    it('should create a new address', async () => {
      const data = {
        placeId: '987470320984732',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      };

      const result = await addressService.createAddress(customerId, data);
      expect(result).toBe(true);

      const address = await Address.findOne({
        where: { ...data },
        raw: true,
      });
      expect(address).not.toBeNull();

      const customerAddress = await CustomerAddress.findOne({
        where: { addressId: address?.addressId, customerId },
        raw: true,
      });
      expect(customerAddress).not.toBeNull();
    });

    it('should fail to create address if user has reached address count limit', async () => {
      const addressData = {
        customerId,
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      };

      const createResult = await Address.bulkCreate(
        Array.from({ length: 5 }, () => ({
          ...addressData,
          placeId: `${Math.random() * 84728947292}`,
        })),
      );

      await CustomerAddress.bulkCreate(
        createResult.map(({ addressId }) => ({ customerId, addressId })),
      );

      const data = {
        placeId: '83047983157319',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      };

      const result = await addressService.createAddress(customerId, data);
      expect(result).toBe(false);

      const address = await Address.findOne({
        where: { ...data },
        raw: true,
      });
      expect(address).toBeNull();
    });
  });

  describe('update address', () => {
    it('should update address successfully', async () => {
      const { addressId } = await Address.create({
        placeId: '83047983157319',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      });

      await CustomerAddress.create({ customerId, addressId });

      const data = {
        placeId: '8759258223',
        name: '4829 West Drive',
        address: 'Rockford, IL',
      };

      const result = await addressService.updateAddress(
        customerId,
        addressId,
        data,
      );
      expect(result).toBe(1);

      const address = await Address.findOne({
        where: { addressId, ...data },
        raw: true,
      });
      expect(address).not.toBeNull();
    });
  });

  describe('delete address', () => {
    it('should delete address', async () => {
      const { addressId } = await Address.create({
        placeId: '97847183970',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
      });

      await CustomerAddress.create({ customerId, addressId });

      const result = await addressService.deleteAddress(customerId, addressId);
      expect(result).toBe(1);

      const address = await Address.findByPk(addressId, { raw: true });
      expect(address).toBeNull();
    });
  });
});
