import { string } from 'zod';

export const otpRules = string()
  .trim()
  .nonempty()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: 'Invalid OTP. Must be a numeric value.',
    path: ['otp'],
  })
  .transform((value) => Number(value));

export const passwordRules = string()
  .trim()
  .min(8, { message: 'Password must be 8 or more characters long' })
  .max(64, { message: 'Password must be 64 or fewer characters long' })
  .regex(/\d/, { message: 'Password must contain at least 1 digit' })
  .regex(/[a-z]/, {
    message: 'Password must contain at least 1 lowercase character',
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least 1 uppercase letter',
  });

export const emailRules = string().trim().email().toLowerCase();

export const idRules = string()
  .trim()
  .nonempty()
  .refine((value) => !Number.isNaN(Number(value)), {
    message: 'Invalid id. Must be a numeric value.',
    path: ['id'],
  })
  .transform((value) => Number(value));
