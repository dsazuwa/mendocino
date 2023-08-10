import { body } from 'express-validator';

import { emailRules, otpRules, passwordRules } from './common.validator';

export const registerRules = [
  body('firstName').notEmpty(),
  body('lastName').notEmpty(),
  emailRules,
  passwordRules,
];

export const loginRules = [emailRules, body('password').notEmpty()];

export const requestRecoverRules = [emailRules];

export const verifyOTPRules = [otpRules, emailRules];

export const recoverRules = [otpRules, emailRules, passwordRules];
