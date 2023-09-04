const capitalizeFirst = (str: string) => {
  if (str.length === 0) return str;

  return str.charAt(0).toUpperCase() + str.slice(1);
};

const messages = {
  // ERROR MESSAGES

  ERR_UNAUTHORIZED_ACCESS: 'Unauthorized',
  ERR_INVALID_ACCESS_TOKEN: 'Invalid access token',

  ERR_DEACTIVATED_ACCOUNT: 'User account deactivated',
  ERR_SUSPENDED_ACCOUNT: 'User account suspended',

  ERR_ACTIVE_ACCOUNT: 'User account active',
  ERR_VERIFIED_ACCOUNT: 'Account already verified',

  ERR_THIRD_PARTY_AUTH_MISSING_DETAILS:
    'Social authentication details are incomplete.',
  ERR_THIRD_PARTY_AUTH_ADMIN:
    'Only customers can use third party authenticators',
  ERR_THIRD_PARTY_AUTH_MISMATCH:
    "Identity exists, but it doesn't match the provided email",

  // COMMON MESSAGES

  INVALID_AUTH_OTP: 'Invalid OTP',

  // AUTH ROUTER MESSAGES

  REGISTER_ALREADY_EXISTS: 'Email already exists',
  REGISTER_SUCCESS: 'Successfully registered!',

  LOGIN_SUCCESS: 'Logged in!',
  LOGIN_FAIL: 'Incorrect email or password',
  LOGIN_ADMIN_2FA: '2FA OTP sent to your email',

  LOGIN_ADMIN_2FA_INVALID: 'Invalid request',
  LOGIN_ADMIN_2FA_SUCCESS: 'Logged in!',

  LOGOUT: 'Logged out!',

  REQUEST_RECOVERY: 'Recovery OTP sent',
  REQUEST_RECOVERY_FAIL_THIRD_PARTY_AUTH: 'Log in with your social account',

  VERIFY_RECOVERY_SUCCESS: 'Account verified!',

  RECOVER_PASSWORD_SUCCESS: 'Password successfully reset!',
  RECOVER_PASSWORD_FAIL: 'Failed to recover password',

  REACTIVATE_SUCCESS: 'Account reactivated!',

  SET_COOKIE_USER_NOT_FOUND: 'Invalid token',
  SET_COOKIE_SUCCESS: 'Authentication cookies set',

  INVALID_REFRESH_TOKEN: 'Invalid refresh token',
  REFRESH_JWT_SUCCESS: 'New access token created',

  // USERS ROUTER

  GET_USER_FAIL: 'Failed to get user',

  // CUSTOMERS ROUTER MESSAGES

  REQUEST_VERIFICATION_EMAIL: 'New OTP sent to your email',
  VERIFY_EMAIL_SUCCESS: 'Email verified!',

  UPDATE_USER_NAME: 'Successfully updated name!',

  CREATE_PASSWORD_SUCCESS: 'Password successfully created!',
  CREATE_PASSWORD_FAIL: 'Failed to create password',

  PASSWORD_CHANGE_SUCCESS: 'Password Successfully changed!',
  PASSWORD_CHANGE_FAIL: 'User account does not exist',

  REVOKE_SOCIAL_SUCCESS: (provider: string) =>
    `Successfully revoked ${capitalizeFirst(provider)} authentication`,
  REVOKE_SOCIAL_FAIL: 'Failed to revoke authentication',

  CLOSE_CLIENT_ACCOUNT: 'Account successfully closed!',

  // PHONE ROUTER MESSAGES

  REGISTER_PHONE_SUCCESS: 'Successfully registered!',

  REQUEST_VERIFICATION_SMS: 'New OTP sent to your phone',

  VERIFY_PHONE_SUCCESS: 'Phone number verified!',

  DELETE_PHONE_SUCCESS: 'Phone number deleted!',
  DELETE_PHONE_FAIL: 'No phone number on record',

  // ADDRESS ROUTER MESSAGES

  CREATE_ADDRESS_SUCCESS: 'Address created!',
  CREATE_ADDRESS_FAIL: 'Failed to create address',

  UPDATE_ADDRESS_SUCCESS: 'Address updated!',
  UPDATE_ADDRESS_FAIL: 'Failed to update address',

  DELETE_ADDRESS_SUCCESS: 'Address deleted!',
  DELETE_ADDRESS_FAIL: 'Failed to delete address',
} as const;

export default messages;
