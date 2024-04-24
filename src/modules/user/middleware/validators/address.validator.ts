import { object, string } from 'zod';

import { idRules } from './common.validator';

const bodyRules = object({
  placeId: string().trim().nonempty(),
  name: string().trim().nonempty(),
  address: string().trim().nonempty(),
  suite: string().trim().optional(),
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
