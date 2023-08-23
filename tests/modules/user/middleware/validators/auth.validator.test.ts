import {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
  requestRecoverySchema,
  verifyRecoveryOTPSchema,
  loginAdminSchema,
} from '@user/middleware/validators/auth.validator';

import {
  testEmailRules,
  testIdRules,
  testOTPRules,
  testPasswordRules,
} from './common.validator';

describe('Auth Validator', () => {
  describe('register schema', () => {
    const body = {
      firstName: 'Joe',
      lastName: 'Doe',
      email: 'joedoe@gmail.com',
      password: 'joeD0epa$$',
    };

    it('should pass for valid data', () => {
      const data = { body };

      expect(() => registerSchema.parse(data)).not.toThrow();
    });

    it('should throw error for empty data', () => {
      const data = {
        body: {
          firstName: ' ',
          lastName: ' ',
          email: ' ',
          password: ' ',
        },
      };

      expect(() => registerSchema.parse(data)).toThrow();
    });

    testEmailRules(registerSchema, body);
    testPasswordRules(registerSchema, body);
  });

  describe('login schema', () => {
    const body = {
      email: 'joedoe@gmail.com',
      password: 'joeD0epa$$',
    };

    it('should pass for valid data', () => {
      const data = { body };
      expect(() => loginSchema.parse(data)).not.toThrow();
    });

    it('should throw error for empty data', () => {
      const data = { body: { email: ' ', password: ' ' } };
      expect(() => loginSchema.parse(data)).toThrow();
    });

    testEmailRules(loginSchema, body);
  });

  describe('login admin', () => {
    it('should pass for valid data', () => {
      const data = { params: { id: '1', otp: '12345' } };
      expect(() => loginAdminSchema.parse(data)).not.toThrow();
    });

    it('should throw error for empty data', () => {
      const data = { body: { id: ' ', otp: ' ' } };
      expect(() => loginAdminSchema.parse(data)).toThrow();
    });

    testOTPRules(loginAdminSchema, {}, { id: '1' });

    testIdRules(loginAdminSchema, {}, { otp: '12345' });
  });

  describe('request recover schema', () => {
    it('should pass for valid email', () => {
      const data = { body: { email: 'joedoe@gmail.com' } };
      expect(() => requestRecoverySchema.parse(data)).not.toThrow();
    });

    testEmailRules(requestRecoverySchema);
  });

  describe('verify recover OTP schema', () => {
    it('should pass for valid data', () => {
      const data = {
        params: { otp: '1234' },
        body: { email: 'joedoe@gmail.com' },
      };

      expect(() => verifyRecoveryOTPSchema.parse(data)).not.toThrow();
    });

    testEmailRules(verifyRecoveryOTPSchema, {}, { otp: '1234' });
    testOTPRules(verifyRecoveryOTPSchema, { email: 'joedoe@gmail.com' });
  });

  describe('recover schema', () => {
    it('should pass for valid data', () => {
      const data = {
        params: { otp: '1234' },
        body: { email: 'joedoe@gmail.com', password: 'joeD0epa$$' },
      };

      expect(() => recoverPasswordSchema.parse(data)).not.toThrow();
    });

    testEmailRules(
      recoverPasswordSchema,
      { password: 'joeD0epa$$' },
      { otp: '1234' },
    );

    testPasswordRules(
      recoverPasswordSchema,
      { email: 'joe@g.com' },
      { otp: '1234' },
    );

    testOTPRules(recoverPasswordSchema, {
      email: 'joedoe@gmail.com',
      password: 'joeD0epa$$',
    });
  });
});
