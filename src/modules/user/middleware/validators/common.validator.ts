import { body, param } from 'express-validator';

export const otpRules = param('otp').exists().isNumeric();

export const passwordRules = body('password')
  .exists()
  .isLength({ min: 8, max: 64 })
  .withMessage('must be between 8 - 64 characters')
  .matches(/\d/)
  .withMessage('must contain at least 1 digit')
  .matches(/[a-z]/)
  .withMessage('must contain at least 1 lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('must contain at least 1 uppercase letter')
  .not()
  .matches(/^\s+|\s+$/)
  .withMessage('no leading or trailing spaces');

export const emailRules = body('email').exists().isEmail().toLowerCase();
