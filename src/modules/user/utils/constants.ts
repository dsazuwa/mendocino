export const ROLES = {
  GUEST: { roleId: 0, name: 'guest' },
  CUSTOMER: { roleId: 1, name: 'customer' },
  DELIVERY_DRIVER: { roleId: 2, name: 'delivery driver' },
  CUSTOMER_SUPPORT: { roleId: 3, name: 'customer support' },
  MANAGER: { roleId: 4, name: 'manager' },
  ADMIN: { roleId: 5, name: 'admin' },
  ROOT: { roleId: 6, name: 'root' },
} as const;
