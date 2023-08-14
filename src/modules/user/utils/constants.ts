export const roleConstants = {
  GUEST: { roleId: 0, name: 'guest' },
  CUSTOMER: { roleId: 1, name: 'customer' },
  DELIVERY_DRIVER: { roleId: 2, name: 'delivery_driver' },
  CUSTOMER_SUPPORT: { roleId: 3, name: 'customer_support' },
  MANAGER: { roleId: 4, name: 'manager' },
  ADMIN: { roleId: 5, name: 'admin' },
  ROOT: { roleId: 6, name: 'root' },
} as const;

export const permissions = {} as const;
