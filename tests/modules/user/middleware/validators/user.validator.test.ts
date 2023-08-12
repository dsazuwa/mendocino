import { verifyEmailSchema } from '@user/middleware/validators/users.validator';

import { testOTPRules } from './common.validator';

describe('User Validator', () => {
  describe('verify email schema', () => {
    testOTPRules(verifyEmailSchema);
  });
});
