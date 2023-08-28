import { string } from 'zod';

export const idRules = string()
  .trim()
  .nonempty()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: 'Invalid id. Must be a numeric value.',
    path: ['id'],
  })
  .transform((value) => Number(value));
