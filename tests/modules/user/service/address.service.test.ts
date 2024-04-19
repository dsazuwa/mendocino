import { Address } from '@app/modules/user/models';
import { addressService } from '@app/modules/user/services';

import { createCustomer } from '../helper-functions';

import '../../../db-setup';

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
      const addressData = [
        {
          placeId: '579432985',
          name: '1957 Kembery Drive',
          address: 'Roselle, IL',
          zipCode: '60172',
          lat: '-90',
          lng: '-40',
        },
        {
          placeId: '9753298532',
          name: '1957 Kembery Drive',
          address: 'Roselle, IL',
          zipCode: '60172',
          lat: '-90',
          lng: '-40',
        },
      ];

      await Address.bulkCreate(
        addressData.map((data) => ({ customerId, ...data })),
      );

      const addresses = await addressService.getAddresses(customerId);
      expect(addresses.length).toBe(2);
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
        zipCode: '60172',
        lat: '-90',
        lng: '-40',
      };

      const result = await addressService.createAddress(customerId, data);
      expect(result).toBe(true);

      const address = await Address.findOne({
        where: { customerId, ...data },
        raw: true,
      });
      expect(address).not.toBeNull();
    });

    it('should fail to create address if user has reached address count limit', async () => {
      const addressData = {
        customerId,
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
        zipCode: '60172',
        lat: '-90',
        lng: '-40',
      };

      await Address.bulkCreate(
        Array.from({ length: 5 }, () => ({
          ...addressData,
          placeId: `${Math.random() * 84728947292}`,
        })),
      );

      const data = {
        placeId: '83047983157319',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
        zipCode: '60172',
        lat: '-90',
        lng: '-40',
      };

      const result = await addressService.createAddress(customerId, data);
      expect(result).toBe(false);

      const address = await Address.findOne({
        where: { customerId, ...data },
        raw: true,
      });
      expect(address).toBeNull();
    });
  });

  /* eslint-enable @typescript-eslint/no-unused-vars */

  describe('update address', () => {
    it('should update address successfully', async () => {
      const { addressId } = await Address.create({
        customerId,
        placeId: '83047983157319',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
        zipCode: '60172',
        lat: '-90',
        lng: '-40',
      });

      const data = {
        placeId: '8759258223',
        name: '4829 West Drive',
        address: 'Rockford, IL',
        zipCode: '63890',
        lat: '-76',
        lng: '-40',
      };

      const result = await addressService.updateAddress(
        customerId,
        addressId,
        data,
      );
      expect(result).toBe(1);

      const address = await Address.findOne({
        where: { customerId, addressId, ...data },
        raw: true,
      });
      expect(address).not.toBeNull();
    });
  });

  describe('delete address', () => {
    it('should delete address', async () => {
      const { addressId } = await Address.create({
        customerId,
        placeId: '97847183970',
        name: '1957 Kembery Drive',
        address: 'Roselle, IL',
        zipCode: '60172',
        lat: '-90',
        lng: '-40',
      });

      const result = await addressService.deleteAddress(customerId, addressId);
      expect(result).toBe(1);

      const address = await Address.findByPk(addressId, { raw: true });
      expect(address).toBeNull();
    });
  });
});
