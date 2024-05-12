import { TypeOf, boolean, object, string } from 'zod';

import { otpRules, passwordRules } from './common.validator';

export const verifyEmailSchema = object({
  params: object({ otp: otpRules }),
});

export const updateCustomerProfile = object({
  firstName: string().trim().min(1, 'First name required').optional(),

  lastName: string().trim().min(1, 'Last name required').optional(),

  email: string().email({ message: 'Invalid email address' }).optional(),

  phoneNumber: string()
    .optional()
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: 'Invalid phone number',
    }),

  receiveStatusByText: boolean().optional(),
});

export type ProfileFormSchema = TypeOf<typeof updateCustomerProfile>;

export const updateUserNameSchema = object({
  body: object({
    firstName: string().trim().optional(),
    lastName: string().trim().optional(),
  }).refine(
    ({ firstName, lastName }) =>
      (!!firstName && firstName.length > 0) ||
      (!!lastName && lastName.length > 0),
    { message: 'At least one of firstName or lastName should be provided' },
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
