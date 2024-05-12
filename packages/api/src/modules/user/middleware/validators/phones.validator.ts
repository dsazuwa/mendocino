import { object, string } from 'zod';

import { otpRules } from './common.validator';

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
