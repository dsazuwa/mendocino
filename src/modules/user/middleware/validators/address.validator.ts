import { object, string } from 'zod';

import { idRules } from './common.validator';

export const createAddressSchema = object({
  body: object({
    addressLine1: string().trim().nonempty('Address line 1 is required.'),
    addressLine2: string().trim().optional(),
    city: string().trim().nonempty('City is required.'),
    state: string().trim().nonempty('State is required.'),
    zipCode: string()
      .trim()
      .nonempty('Postal code is required.')
      .refine((value) => /^\d{5}$/.test(value), {
        message:
          'Invalid postal code format. Postal code must be a 5-digit number.',
      }),
  }),
});

export const updateAddressSchema = object({
  params: object({
    id: idRules,
  }),

  body: object({
    addressLine1: string().trim().optional(),
    addressLine2: string().trim().optional(),
    city: string().trim().optional(),
    state: string().trim().optional(),
    zipCode: string()
      .trim()
      .optional()
      .refine((value) => (value ? /^\d{5}$/.test(value) : true), {
        message:
          'Invalid postal code format. Postal code must be a 5-digit number.',
      }),
  }).refine(
    ({ addressLine1, addressLine2, city, state, zipCode }) =>
      (!!addressLine1 && addressLine1.length > 0) ||
      (!!addressLine2 && addressLine2.length > 0) ||
      (!!city && city.length > 0) ||
      (!!state && state.length > 0) ||
      (!!zipCode && zipCode.length > 0),
    { message: 'Must provide a least one field' },
  ),
});

export const deleteAddressSchema = object({
  params: object({
    id: idRules,
  }),
});
