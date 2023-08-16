import { object, string } from 'zod';

import { otpRules, passwordRules } from './common.validator';

export const verifyEmailSchema = object({
  params: object({ otp: otpRules }),
});

export const registerPhoneSchema = object({
  body: object({
    phoneNumber: string()
      .trim()
      .nonempty()
      .length(10, 'Phone number must be 10 digits')
      .refine(
        (value) => !Number.isNaN(Number(value)),
        'Invalid: Must be a numeric value.',
      )
      .transform((value) => Number(value)),
  }),
});

export const verifyPhoneSchema = object({
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
