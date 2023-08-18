export const TABLENAMES = {
  USER: 'user_profiles',
  USER_ACCOUNT: 'user_accounts',
  USER_IDENTITY: 'user_identities',

  ROLE: 'roles',
  USER_ROLE: 'users_roles',

  AUTH_OTP: 'auth_otps',
  ADDRESS: 'addresses',
  PHONE_NUMBER: 'phone_numbers',
};

export const ROLES = {
  GUEST: { roleId: 0, name: 'guest' },
  CUSTOMER: { roleId: 1, name: 'customer' },
  DELIVERY_DRIVER: { roleId: 2, name: 'delivery driver' },
  CUSTOMER_SUPPORT: { roleId: 3, name: 'customer support' },
  MANAGER: { roleId: 4, name: 'manager' },
  SUPER_USER: { roleId: 5, name: 'super user' },
  ROOT: { roleId: 6, name: 'root' },
} as const;
