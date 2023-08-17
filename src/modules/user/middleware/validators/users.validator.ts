import { object, string } from 'zod';

import { otpRules, passwordRules } from './common.validator';

export const verifyEmailSchema = object({
  params: object({ otp: otpRules }),
});

export const updateUserNameSchema = object({
  body: object({
    firstName: string().trim().optional(),
    lastName: string().trim().optional(),
  }).refine(
    ({ firstName, lastName }) =>
      (!!firstName && firstName.length > 0) ||
      (!!lastName && lastName.length > 0),
    { message: 'At least one of firstName or lastName is required' },
  ),
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
  }).refine(
    ({ currentPassword, newPassword }) => currentPassword !== newPassword,
    {
      path: ['newPassword'],
      message: 'New password and current password must not match',
    },
  ),
});

export const revokeSocialAuthenticationSchema = object({
  body: object({
    provider: string().refine((p: string) =>
      ['google', 'facebook'].includes(p),
    ),
  }),
});
