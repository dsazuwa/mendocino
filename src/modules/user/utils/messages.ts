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

  ERR_ACTIVE_ACCOUNT: 'User account already active',
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

  LOGIN_FAILED: 'Incorrect email or password',
  LOGIN_SUCCESS: 'Logged in!',

  LOGOUT: 'Logged out!',

  REQUEST_RECOVERY: 'Recovery OTP sent',
  REQUEST_RECOVERY_FAILED_THIRD_PARTY_AUTH: 'Log in with your social account',

  VERIFY_RECOVERY_SUCCESS: 'Account verified!',
  RECOVER_PASSWORD_SUCCESS: 'Password successfully reset!',

  REACTIVATE_SUCCESS: 'Account reactivated!',

  // USERS ROUTER MESSAGES

  REQUEST_VERIFICATION_EMAIL: 'New OTP sent to your email',
  VERIFY_EMAIL_SUCCESS: 'Email verified!',

  UPDATE_USER_NAME: 'Successfully updated name!',

  CREATE_PASSWORD_FAILED: 'Failed to create password',
  CREATE_PASSWORD_SUCCESS: 'Password successfully created!',

  PASSWORD_CHANGE_FAILED: 'User account does not exist',
  PASSWORD_CHANGE_SUCCESS: 'Password Successfully changed!',

  REVOKE_SOCIAL_SUCCESS: (provider: string) =>
    `Successfully revoked ${capitalizeFirst(provider)} authentication`,

  CLOSE_CLIENT_ACCOUNT: 'Account successfully closed!',

  // PHONE ROUTER MESSAGES

  REGISTER_PHONE_SUCCESS: 'Successfully registered!',

  REQUEST_VERIFICATION_SMS: 'New OTP sent to your phone',

  VERIFY_PHONE_SUCCESS: 'Phone number verified!',

  DELETE_PHONE_FAIL: 'No phone number on record',
  DELETE_PHONE_SUCCESS: 'Phone number deleted!',

  // ADDRESS ROUTER MESSAGES

  CREATE_ADDRESS_SUCCESS: 'Address created!',
  CREATE_ADDRESS_FAIL: 'Failed to create address',

  UPDATE_ADDRESS_SUCCESS: 'Address updated!',
  UPDATE_ADDRESS_FAIL: 'Failed to update address',

  DELETE_ADDRESS_SUCCESS: 'Address deleted!',
  DELETE_ADDRESS_FAIL: 'Failed to delete address',
} as const;

export default messages;
