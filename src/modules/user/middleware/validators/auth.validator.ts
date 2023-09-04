import { object, string } from 'zod';

import {
  emailRules,
  idRules,
  otpRules,
  passwordRules,
} from './common.validator';

export const registerSchema = object({
  body: object({
    firstName: string()
      .trim()
      .nonempty('First name must contain at least 1 character(s)'),
    lastName: string()
      .trim()
      .nonempty('Last name must contain at least 1 character(s)'),
    email: emailRules,
    password: passwordRules,
  }),
});

export const loginSchema = object({
  body: object({
    email: emailRules,
    password: string().trim().nonempty(),
  }),
});

export const loginAdminSchema = object({
  params: object({ id: idRules, otp: otpRules }),
});

export const requestRecoverySchema = object({
  body: object({ email: emailRules }),
});

export const verifyRecoveryOTPSchema = object({
  params: object({ otp: otpRules }),
  body: object({ email: emailRules }),
});

export const recoverPasswordSchema = object({
  params: object({ otp: otpRules }),
  body: object({ email: emailRules, password: passwordRules }),
});

export const setCookieSchema = object({
  body: object({
    jwt: string().trim().nonempty(),
    refreshToken: string().trim().nonempty(),
  }),
});
