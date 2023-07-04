import { param, query } from 'express-validator';

export const allowedGroupByFields = ['category', 'status', 'tag'];

export const menuGroupingRules = [
  query('by')
    .notEmpty()
    .withMessage('Missing group by paramater')
    .custom((value) => {
      if (!allowedGroupByFields.includes(value)) throw new Error('Invalid groupBy paramater');
      return true;
    }),
];

export const getByIdRules = [
  param('id').notEmpty().isNumeric().withMessage('Expected a numeric ID'),
];
