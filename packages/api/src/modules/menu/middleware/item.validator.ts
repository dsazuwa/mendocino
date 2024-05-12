import { object, array, string } from 'zod';

import { idRules, isItemStatusType } from './common.validator';

export const createItemSchema = object({
  body: object({
    name: string()
      .trim()
      .min(1, { message: 'Name required' })
      .max(100, { message: 'Name must be 100 or fewer characters long' }),

    description: string()
      .trim()
      .min(1, { message: 'Description required' })
      .max(255, {
        message: 'Description must be 255 or fewer characters long',
      }),

    category: string().trim().nonempty('Category required'),

    tags: array(string()).optional(),

    price: string()
      .trim()
      .nonempty()
      .refine((value) => !Number.isNaN(Number(value)), {
        message: 'Invalid price',
        path: ['price'],
      })
      .transform((value) => Number(value)),

    status: string()
      .trim()
      .nonempty('Status required')
      .refine((value) => isItemStatusType(value), {
        message: 'Invalid status',
      }),

    photoUrl: string()
      .trim()
      .min(1, { message: 'Url required' })
      .max(100, { message: 'Url must be 100 or fewer characters long' }),
  }),
});

export const updateItemSchema = object({
  params: object({ id: idRules }),

  body: object({
    name: string()
      .optional()
      .refine((value) => (value === undefined ? true : value.length < 100), {
        message: 'Name must be 100 or fewer characters long',
      }),

    description: string()
      .optional()
      .refine((value) => (value === undefined ? true : value.length < 255), {
        message: 'Description must be 255 or fewer characters long',
      }),

    category: string().optional(),

    // tags: array(string()).optional(),

    // prices: array(pricesSchema)
    //   .optional()
    //   .refine(
    //     (prices) => {
    //       if (!prices) return true;
    //       const hasDefaultSize = prices.some((item) => item.size === 'default');
    //       return !hasDefaultSize || (hasDefaultSize && prices.length === 1);
    //     },
    //     { message: "Can't have multiple prices if there is a default price" },
    //   ),

    status: string()
      .optional()
      .refine((value) => !value || (value && isItemStatusType(value)), {
        message: 'Invalid status',
      }),

    photoUrl: string()
      .optional()
      .refine((value) => (value === undefined ? true : value.length < 100), {
        message: 'Url must be 100 or fewer characters long',
      }),
  }).refine(
    ({ name, description, category, status, photoUrl }) =>
      (!!name && name.length > 0) ||
      (!!description && description.length > 0) ||
      (!!category && category.length > 0) ||
      (!!status && status.length > 0) ||
      (!!photoUrl && photoUrl.length > 0),
    { message: 'At least one field is required' },
  ),
});

export const updateItemStatusSchema = object({
  params: object({ id: idRules }),
  body: object({
    status: string()
      .trim()
      .nonempty('Status required')
      .refine((value) => value === 'active' || value === 'sold out', {
        message: 'Invalid status: must be either active or sold out',
      }),
  }),
});

export const deleteItemSchema = object({
  params: object({ id: idRules }),
});
