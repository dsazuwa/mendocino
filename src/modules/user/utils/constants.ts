export const roleConstants = {
  GUEST: { roleId: 0, name: 'guest' },
  CUSTOMER: { roleId: 1, name: 'customer' },
  DELIVERY_DRIVER: { roleId: 2, name: 'delivery driver' },
  CUSTOMER_SUPPORT: { roleId: 3, name: 'customer support' },
  MANAGER: { roleId: 4, name: 'manager' },
  ADMIN: { roleId: 5, name: 'admin' },
  ROOT: { roleId: 6, name: 'root' },
} as const;

export const permissionConstants = {
  CREATE_ADMIN: { permissionId: 1, name: 'create admin' },
  CREATE_MANAGER: { permissionId: 2, name: 'create manager' },
  CREATE_CUSTOMER_SERVICE: { permissionId: 3, name: 'create customer service' },
  CREATE_DELIVERY_DRIVER: { permissionId: 4, name: 'create delivery driver' },
} as const;

const getRolePermission = (
  roleId: number,
  permissions: { permissionId: number; name: string }[],
) => {
  const rolePermissions: { roleId: number; permissionId: number }[] = [];

  permissions.forEach(({ permissionId }) =>
    rolePermissions.push({ roleId, permissionId }),
  );

  return rolePermissions;
};

const rootPermissions = getRolePermission(roleConstants.ROOT.roleId, [
  permissionConstants.CREATE_ADMIN,
  permissionConstants.CREATE_MANAGER,
  permissionConstants.CREATE_CUSTOMER_SERVICE,
  permissionConstants.CREATE_DELIVERY_DRIVER,
]);

const adminPermissions = getRolePermission(roleConstants.ADMIN.roleId, [
  permissionConstants.CREATE_MANAGER,
  permissionConstants.CREATE_CUSTOMER_SERVICE,
  permissionConstants.CREATE_DELIVERY_DRIVER,
]);

export const rolePermissionConstants = [
  ...rootPermissions,
  ...adminPermissions,
] as const;
