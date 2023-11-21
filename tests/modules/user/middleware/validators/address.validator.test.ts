import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from '@app/modules/user/middleware/validators/address.validator';

import { testIdRules } from './common.validator';

describe('create address schema', () => {
  it('should pass for valid data', () => {
    const addresses = [
      {
        addressLine1: '123 Main St',
        city: 'Townsville',
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
    ];

    addresses.forEach((address) => {
      const data = { body: { ...address } };
      expect(() => createAddressSchema.parse(data)).not.toThrow();
    });
  });

  it('should fail for invalid data', () => {
    const addresses = [
      {},
      {
        city: 'Exampleville',
        state: 'CA',
        postalCode: '12345',
      },
      {
        addressLine1: '456 Elm Rd',
        addressLine2: 'Suite 789',
        state: 'NY',
        postalCode: '67890',
      },
      {
        addressLine1: '789 Pine Ave',
        city: 'Cityburg',
        postalCode: '54321',
      },
      {
        addressLine1: '987 Oak Blvd',
        city: 'Villageville',
        state: 'FL',
        postalCode: '123456',
      },
      {
        addressLine1: '246 Maple Ln',
        city: 'Countryside',
        state: 'IL',
      },
      {
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
      },
      {
        addressLine1: ' ',
        addressLine2: ' ',
        city: ' ',
        state: ' ',
        postalCode: ' ',
      },
    ];

    addresses.forEach((address) => {
      const data = { body: { ...address } };
      expect(() => createAddressSchema.parse(data)).toThrow();
    });
  });
});

describe('update address', () => {
  it('should pass for valid address data', () => {
    const addresses = [
      { addressLine1: '123 Main St' },
      { addressLine2: 'Suite 789' },
      { city: 'Townsville' },
      { state: 'CA' },
      { postalCode: '12345' },
      {
        addressLine1: '456 Elm Rd',
        addressLine2: 'Suite 789',
        city: 'Townsville',
        state: 'NY',
        postalCode: '67890',
      },
    ];

    addresses.forEach((address) => {
      const data = { params: { id: '1' }, body: { ...address } };
      expect(() => updateAddressSchema.parse(data)).not.toThrow();
    });
  });

  it('should fail for invalid address data', () => {
    const addresses = [{}, { city: ' ' }];

    addresses.forEach((address) => {
      const data = { params: { id: '1' }, body: { ...address } };
      expect(() => updateAddressSchema.parse(data)).toThrow();
    });
  });

  testIdRules(updateAddressSchema, { state: 'Illinois' });
});

describe('delete address schema', () => {
  testIdRules(deleteAddressSchema);
});
