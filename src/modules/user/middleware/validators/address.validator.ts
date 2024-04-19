import { number, object, string } from 'zod';

import { idRules } from './common.validator';

const bodyRules = object({
  placeId: string().trim().nonempty(),
  suite: string().trim().optional(),
  name: string().trim().nonempty(),
  address: string().trim().nonempty(),

  zipCode: string()
    .trim()
    .nonempty('Postal code is required.')
    .refine((value) => /^\d{5}$/.test(value), {
      message:
        'Invalid postal code format. Postal code must be a 5-digit number.',
    }),

  lat: number(),
  lng: number(),
});

export const createAddressSchema = object({
  body: bodyRules,
});

export const updateAddressSchema = object({
  params: object({ id: idRules }),
  body: bodyRules,
});

export const deleteAddressSchema = object({
  params: object({ id: idRules }),
});
