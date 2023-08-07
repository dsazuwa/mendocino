import { body } from 'express-validator';

import { passwordRules } from './common.validator';

export const registerRules = [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  body('email').notEmpty().isEmail().normalizeEmail(),
  passwordRules,
];
