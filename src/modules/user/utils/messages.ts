const messages = Object.freeze({
  ERR_INVALID_ACCESS_TOKEN: 'Invalid access token',
  ERR_DEACTIVATED_ACCOUNT: 'Deactivated account',
  ERR_ACTIVE_ACCOUNT: 'Active account',
  ERR_VERIFIED_ACCOUNT: 'Account already verified',

  INVALID_AUTH_OTP: 'Invalid OTP',

  REGISTER_ALREADY_EXISTS: 'Email already exists',
  REGISTER_SUCCESS: 'Successfully registered!',

  LOGIN_FAILED: 'Incorrect email or password',
  LOGIN_SUCCESS: 'Logged in!',

  LOGOUT: 'Logged out!',

  REQUEST_RECOVERY: 'Recovery OTP sent',
  REQUEST_RECOVERY_FAILED_THIRD_PARTY_AUTH: 'Log in with your social account',

  VERIFY_RECOVERY_SUCCESS: 'Account verified!',
  RECOVER_PASSWORD_SUCCESS: 'Password successfully reset!',
});

export default messages;
