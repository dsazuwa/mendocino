import { Address } from '@user/models';
import addressService from '@user/services/address.service';
import { ROLES } from '@user/utils/constants';

import { createUserAccount } from 'tests/modules/user/helper-functions';

import 'tests/user.db-setup';

describe('address management', () => {
  let userId: number;

  beforeAll(async () => {
    const { user } = await createUserAccount(
      'Jimmy',
      'Doe',
      'jimmydoe@gmail.com',
      'jimmyD0ePa$$',
      'active',
      [ROLES.CUSTOMER.roleId],
    );
    userId = user.userId;
  });

  beforeEach(async () => {
    await Address.destroy({ where: {} });
  });

  describe('get addresses', () => {
    it('should get all addresses for user', async () => {
      const addressData = [
        {
          addressLine1: '123 Main St',
          addressLine2: null,
          city: 'Exampleville',
          state: 'CA',
          postalCode: '12345',
        },
        {
          addressLine1: '456 Elm Rd',
          addressLine2: 'Suite 789',
          city: 'Townsville',
          state: 'NY',
          postalCode: '67890',
        },
        {
          addressLine1: '789 Pine Ave',
          addressLine2: null,
          city: 'Cityburg',
          state: 'TX',
          postalCode: '54321',
        },
        {
          addressLine1: '101 Maple St',
          addressLine2: 'Unit 202',
          city: 'Villageville',
          state: 'FL',
          postalCode: '45678',
        },
        {
          addressLine1: '222 Oak Ln',
          addressLine2: null,
          city: 'Ruralville',
          state: 'KS',
          postalCode: '98765',
        },
      ];

      await Address.bulkCreate(
        addressData.map((data) => ({ userId, ...data })),
      );

      const addresses = await addressService.getAddresses(userId);
      expect(addresses).toMatchObject(expect.arrayContaining(addressData));
    });

    it('should return empty array for non existent user', async () => {
      const addresses = await addressService.getAddresses(1000);
      expect(addresses).toStrictEqual([]);
    });
  });

  /* eslint-disable @typescript-eslint/no-unused-vars */

  describe('create address', () => {
    it('should create a new address', async () => {
      const data = {
        addressLine1: '222 Oak Ln',
        addressLine2: undefined,
        city: 'Ruralville',
        state: 'KS',
        postalCode: '98765',
      };

      const result = await addressService.createAddress(userId, data);
      expect(result).toBe(true);

      const { addressLine2, ...rest } = data;

      const address = await Address.findOne({
        where: { userId, ...rest },
        raw: true,
      });
      expect(address).not.toBeNull();
    });

    it('should fail to create address if user has reach address count limit', async () => {
      await Address.bulkCreate([
        {
          userId,
          addressLine1: '123 Main St',
          addressLine2: null,
          city: 'Exampleville',
          state: 'CA',
          postalCode: '12345',
        },
        {
          userId,
          addressLine1: '456 Elm Rd',
          addressLine2: 'Suite 789',
          city: 'Townsville',
          state: 'NY',
          postalCode: '67890',
        },
        {
          userId,
          addressLine1: '789 Pine Ave',
          addressLine2: null,
          city: 'Cityburg',
          state: 'TX',
          postalCode: '54321',
        },
        {
          userId,
          addressLine1: '101 Maple St',
          addressLine2: 'Unit 202',
          city: 'Villageville',
          state: 'FL',
          postalCode: '45678',
        },
        {
          userId,
          addressLine1: '222 Oak Ln',
          addressLine2: null,
          city: 'Ruralville',
          state: 'KS',
          postalCode: '98765',
        },
      ]);

      const data = {
        addressLine1: '64 Oak Ln',
        addressLine2: undefined,
        city: 'Rock Island',
        state: 'KS',
        postalCode: '98765',
      };

      const result = await addressService.createAddress(userId, data);
      expect(result).toBe(false);

      const { addressLine2, ...rest } = data;

      const address = await Address.findOne({
        where: { userId, ...rest },
        raw: true,
      });
      expect(address).toBeNull();
    });
  });

  /* eslint-enable @typescript-eslint/no-unused-vars */

  describe('update address', () => {
    it('should update address successfully', async () => {
      const { addressId } = await Address.create({
        userId,
        addressLine1: '222 Oak Ln',
        addressLine2: undefined,
        city: 'Ruralville',
        state: 'KS',
        postalCode: '98765',
      });

      const state = 'CA';

      const result = await addressService.updateAddress(userId, addressId, {
        state,
      });
      expect(result).toBe(1);

      const address = await Address.findOne({
        where: { userId, addressId, state },
        raw: true,
      });
      expect(address).not.toBeNull();
    });

    it('should not update with no fields to update', async () => {
      const u = jest.fn();

      const { update } = Address;
      Address.update = u;

      const result = await addressService.updateAddress(1, 1, {});

      expect(result).toBe(0);
      expect(u).not.toHaveBeenCalled();

      Address.update = update;
    });

    it('should handle invalid address ID', async () => {
      const result = await addressService.updateAddress(userId, 1, {
        state: 'CA',
      });
      expect(result).toBe(0);
    });

    it('should handle invalid user ID', async () => {
      const result = await addressService.updateAddress(1000, 1, {
        state: 'CA',
      });
      expect(result).toBe(0);
    });
  });

  describe('delete address', () => {
    it('should delete address', async () => {
      const { addressId } = await Address.create({
        userId,
        addressLine1: '222 Oak Ln',
        addressLine2: undefined,
        city: 'Ruralville',
        state: 'KS',
        postalCode: '98765',
      });

      const result = await addressService.deleteAddress(userId, addressId);
      expect(result).toBe(1);

      const address = await Address.findByPk(addressId, { raw: true });
      expect(address).toBeNull();
    });

    it('should fail to delete non existent address', async () => {
      const address = await Address.findOne({
        where: { userId: 1000, addressId: 1 },
        raw: true,
      });
      expect(address).toBeNull();

      const result = await addressService.deleteAddress(1000, 1);
      expect(result).toBe(0);
    });
  });
});
