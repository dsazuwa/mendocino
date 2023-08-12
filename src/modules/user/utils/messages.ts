const messages = Object.freeze({
  // ERROR MESSAGES

  ERR_INVALID_ACCESS_TOKEN: 'Invalid access token',
  ERR_DEACTIVATED_ACCOUNT: 'Deactivated account',
  ERR_ACTIVE_ACCOUNT: 'Active account',
  ERR_VERIFIED_ACCOUNT: 'Account already verified',

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

  REQUEST_VERIFICATION: 'New verification OTP sent',
  VERIFY_EMAIL_SUCCESS: 'Email Successfully Verified!',

  CREATE_PASSWORD_FAILED: 'Failed to create password',
  CREATE_PASSWORD_SUCCESS: 'Password successfully created!',

  PASSWORD_CHANGE_FAILED: 'User account does not exist',
  PASSWORD_CHANGE_SUCCESS: 'Password Successfully changed!',
});

export default messages;
