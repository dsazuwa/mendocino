import { param } from 'express-validator';

export const codeRules = param('code')
  .notEmpty()
  .isNumeric()
  .withMessage('Expected a numeric code');
