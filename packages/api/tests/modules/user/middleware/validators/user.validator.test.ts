import {
  changePasswordSchema,
  createPasswordSchema,
  revokeSocialAuthenticationSchema,
  updateCustomerProfile,
  updateUserNameSchema,
  verifyEmailSchema,
} from '@app/modules/user/middleware/validators/users.validator';

import { testOTPRules, testPasswordRules } from './common.validator';

describe('verify email schema', () => {
  testOTPRules(verifyEmailSchema);
});

describe('update customer profile', () => {
  it('should pass for valid data', () => {
    const testData = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        receiveStatusByText: true,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
      },
      {
        email: 'john.doe@example.com',
      },
      {
        phoneNumber: '1234567890',
      },
      {
        phoneNumber: '1234567890',
        receiveStatusByText: false,
      },
      {
        phoneNumber: '1234567890',
        receiveStatusByText: true,
      },
    ];

    testData.forEach((data) => {
      expect(updateCustomerProfile.safeParse(data).success).toBe(true);
    });
  });

  it('should throw errors for invalid data', () => {
    const invalidData = [
      {
        firstName: '', // Empty first name
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        receiveStatusByText: true,
      },
      {
        firstName: 'John',
        lastName: '', // Empty last name
        email: 'john.doe@example.com',
        phoneNumber: '1234567890',
        receiveStatusByText: true,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email', // Invalid email format
        phoneNumber: '1234567890',
        receiveStatusByText: true,
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '12345', // Invalid phone number length
        receiveStatusByText: true,
      },
      {},
    ];

    invalidData.forEach((data) => {
      expect(() => updateCustomerProfile.parse(data)).toThrow();
    });
  });
});

describe('update user name schema', () => {
  const testUpdateSchema = (
    firstName: string | undefined,
    lastName: string | undefined,
    throws: boolean,
  ) => {
    const data = { body: { firstName, lastName } };

    if (throws) expect(() => updateUserNameSchema.parse(data)).toThrow();
    else expect(() => updateUserNameSchema.parse(data)).not.toThrow();
  };

  it('should pass if both firstName and lastName are provided', () => {
    testUpdateSchema('Jane', 'Doe', false);
  });

  it('should pass if either firstName and lastName are provided', () => {
    testUpdateSchema('Jane', '', false);
    testUpdateSchema('Jane', ' ', false);
    testUpdateSchema('Jane', undefined, false);

    testUpdateSchema('', 'Doe', false);
    testUpdateSchema(' ', 'Doe', false);
    testUpdateSchema(undefined, 'Doe', false);
  });

  it('should fail if neither firstName nor lastName are provided', () => {
    testUpdateSchema('', '', true);
    testUpdateSchema(' ', ' ', true);
    testUpdateSchema(undefined, undefined, true);
  });
});

describe('create password', () => {
  testPasswordRules(createPasswordSchema);
});

describe('change password schema', () => {
  it('should pass with valid data', () => {
    const data = {
      body: {
        currentPassword: 'currentD0ePa$$',
        newPassword: 'newD0ePa$$',
      },
    };

    expect(() => changePasswordSchema.parse(data)).not.toThrow();
  });

  it('should fail if currentPassword and newPassword are the same', () => {
    const data = {
      body: {
        currentPassword: 'newD0ePa$$',
        newPassword: 'newD0ePa$$',
      },
    };

    expect(() => changePasswordSchema.parse(data)).toThrow();
  });

  it('should fail if currentPassword is not provided', () => {
    const data = {
      body: {
        newPassword: 'newD0ePa$$',
      },
    };

    expect(() => changePasswordSchema.parse(data)).toThrow();
  });

  testPasswordRules(changePasswordSchema, {
    currentPassword: 'currentD0ePa$$',
  });
});

describe('revoke social auth schema', () => {
  it('should pass for valid provider', () => {
    let data = { body: { provider: 'google' } };
    expect(() => revokeSocialAuthenticationSchema.parse(data)).not.toThrow();

    data = { body: { provider: 'facebook' } };
    expect(() => revokeSocialAuthenticationSchema.parse(data)).not.toThrow();
  });

  it('should throw error for invalid provider', () => {
    const providers: string[] = ['g', 'goog', '', ' ', 'yahoo'];

    providers.forEach((provider) => {
      const data = { body: { provider } };
      expect(() => revokeSocialAuthenticationSchema.parse(data)).toThrow();
    });
  });
});
