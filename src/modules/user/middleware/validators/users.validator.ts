import { object } from 'zod';

import { otpRules } from './common.validator';

export const verifyEmailSchema = object({
  params: object({ otp: otpRules }),
});
