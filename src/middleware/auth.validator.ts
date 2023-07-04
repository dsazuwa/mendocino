import { body, param } from 'express-validator';

export const passwordRules = body('password')
  .trim()
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

export const registerRules = [
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  passwordRules,
];

export const loginRules = [
  body('email', 'valid email not provided').trim().notEmpty().isEmail().normalizeEmail().trim(),
  body('password', 'password not provided').trim().notEmpty(),
];

export const codeRules = param('code')
  .notEmpty()
  .isNumeric()
  .withMessage('Expected a numeric code');

export const recoverPasswordRules = [codeRules, passwordRules];
