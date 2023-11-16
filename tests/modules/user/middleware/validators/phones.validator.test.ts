import {
  registerPhoneSchema,
  verifyPhoneSchema,
} from 'modules/user/middleware/validators/phones.validator';

import { testOTPRules } from './common.validator';

describe('register phone schema', () => {
  it('should pass for valid data', () => {
    const phoneNumbers = ['1234567890', ' 1234567890', '1234567890 '];

    phoneNumbers.forEach((phoneNumber) => {
      const data = { body: { phoneNumber } };
      expect(() => registerPhoneSchema.parse(data)).not.toThrow();
    });
  });

  it('should fail for invalid data', () => {
    const phoneNumbers = ['', ' ', ' 123456789', '123456 7890'];

    phoneNumbers.forEach((phoneNumber) => {
      const data = { body: { phoneNumber } };
      expect(() => registerPhoneSchema.parse(data)).toThrow();
    });
  });
});

describe('verify phone schema', () => {
  testOTPRules(verifyPhoneSchema);
});
