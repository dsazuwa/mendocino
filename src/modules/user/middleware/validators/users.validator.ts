import { object, string } from 'zod';

import { otpRules, passwordRules } from './common.validator';

export const verifyEmailSchema = object({
  params: object({ otp: otpRules }),
});

export const createPasswordSchema = object({
  body: object({
    password: passwordRules,
  }),
});

export const changePasswordSchema = object({
  body: object({
    currentPassword: string().trim().nonempty('Current password required'),
    newPassword: passwordRules,
  }),
}).refine((data) => data.body.currentPassword !== data.body.newPassword, {
  path: ['newPassword'],
  message: 'New password and current password must not match',
});
