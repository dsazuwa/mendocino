import {
  createAddressSchema,
  deleteAddressSchema,
  updateAddressSchema,
} from '@app/modules/user/middleware/validators/address.validator';

import { testIdRules } from './common.validator';

const validData = [
  {
    suite: 'Suite 409',
    placeId: '84w98427972942',
    name: '1957 Kembery Drive',
    address: 'Roselle, IL',
    zipCode: '60172',
    lat: -90,
    lng: -40,
  },
  {
    placeId: '84w98427972942',
    name: '1957 Kembery Drive',
    address: 'Roselle, IL',
    zipCode: '60172',
    lat: -90,
    lng: -40,
  },
];

const invalidData = [
  {},
  {
    suite: 'Suite 409',
    placeId: '84w98427972942',
    name: '1957 Kembery Drive',
    address: 'Roselle, IL',
    zipCode: '60173422',
    lat: -90,
    lng: -40,
  },
  {
    name: '1957 Kembery Drive',
    address: 'Roselle, IL',
    zipCode: '60172',
    lat: -90,
    lng: -40,
  },
  {
    placeId: '',
    name: '',
    address: '',
    zipCode: '',
    lat: -90,
    lng: -40,
  },
  {
    placeId: ' ',
    name: ' ',
    address: ' ',
    zipCode: ' ',
    lat: -90,
    lng: -40,
  },
];

describe('create address schema', () => {
  it('should pass for valid data', () => {
    validData.forEach((address) => {
      const data = { body: { ...address } };
      expect(() => createAddressSchema.parse(data)).not.toThrow();
    });
  });

  it('should fail for invalid data', () => {
    invalidData.forEach((address) => {
      const data = { body: { ...address } };
      expect(() => createAddressSchema.parse(data)).toThrow();
    });
  });
});

describe('update address', () => {
  it('should pass for valid address data', () => {
    validData.forEach((address) => {
      const data = { params: { id: '1' }, body: { ...address } };
      expect(() => updateAddressSchema.parse(data)).not.toThrow();
    });
  });

  it('should fail for invalid address data', () => {
    invalidData.forEach((address) => {
      const data = { params: { id: '1' }, body: { ...address } };
      expect(() => updateAddressSchema.parse(data)).toThrow();
    });
  });

  testIdRules(updateAddressSchema, validData[0]);
});

describe('delete address schema', () => {
  testIdRules(deleteAddressSchema);
});
