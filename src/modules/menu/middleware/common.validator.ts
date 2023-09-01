import { string } from 'zod';

import { ItemStatusType } from '@menu/models';

export const idRules = string()
  .trim()
  .nonempty()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: 'Invalid id. Must be a numeric value.',
    path: ['id'],
  })
  .transform((value) => Number(value));

export const isItemStatusType = (value: string): value is ItemStatusType =>
  value === 'active' ||
  value === 'sold out' ||
  value === 'coming soon' ||
  value === 'inactive' ||
  value === 'discountinued';
