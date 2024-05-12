export const USER_SCHEMA = 'users';

export const TABLENAMES = {
  EMAIL: 'emails',
  PHONE: 'phones',
  GUEST: 'guests',

  ROLE: 'roles',
  ADMIN_ROLE: 'admins_roles',

  ADMIN: 'admins',
  ADMIN_ACCOUNT: 'admin_accounts',
  ADMIN_OTP: 'admin_otps',
  ADMIN_REFRESH_TOKEN: 'admin_refresh_tokens',
  ADMIN_PHONE: 'admin_phones',

  CUSTOMER: 'customers',
  CUSTOMER_EMAIL: 'customer_emails',
  CUSTOMER_PASSWORD: 'customer_passwords',
  CUSTOMER_IDENTITY: 'customer_identities',
  CUSTOMER_OTP: 'customer_otps',
  CUSTOMER_REFRESH_TOKEN: 'customer_refresh_tokens',
  CUSTOMER_PHONE: 'customer_phones',

  ADDRESS: 'addresses',
  CUSTOMER_ADDRESS: 'customer_addresses',
  GUEST_ADDRESS: 'guest_addresses',
};

export const ROLES = {
  DELIVERY_DRIVER: { roleId: 1, name: 'delivery driver' },
  CUSTOMER_SUPPORT: { roleId: 2, name: 'customer support' },
  MANAGER: { roleId: 3, name: 'manager' },
  SUPER_ADMIN: { roleId: 4, name: 'super admin' },
  ROOT: { roleId: 5, name: 'root' },
} as const;
