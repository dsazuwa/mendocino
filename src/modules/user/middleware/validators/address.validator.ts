import { number, object, string } from 'zod';

import { idRules } from './common.validator';

const bodyRules = object({
  placeId: string().trim().nonempty(),
  name: string().trim().nonempty(),
  address: string().trim().nonempty(),
  suite: string().trim().optional(),

  streetNumber: string().trim().optional(),
  street: string().trim().optional(),
  city: string().trim().optional(),
  state: string().trim().optional(),

  zipCode: string()
    .trim()
    .optional()
    .refine((value) => (value === undefined ? true : /^\d{5}$/.test(value)), {
      message: 'Invalid zip code, must be a 5-digit number.',
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
