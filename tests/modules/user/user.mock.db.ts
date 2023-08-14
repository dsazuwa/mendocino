import sequelize from '@App/db';

import { Permission, Role, RolePermission } from '@user/models';
import { roleConstants } from '@user/utils/constants';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await Role.bulkCreate([
    roleConstants.CUSTOMER,
    roleConstants.DELIVERY_DRIVER,
    roleConstants.CUSTOMER_SUPPORT,
    roleConstants.MANAGER,
    roleConstants.ADMIN,
    roleConstants.ROOT,
  ]);

  await Permission.bulkCreate([
    { name: 'VIEW_ORDER' },
    { name: 'CREATE_ORDER' },
    { name: 'CANCEL_ORDER' },
    { name: 'CONFIRM_ORDER' },
    { name: 'MODIFY_ORDER' },
    { name: 'DELIVER_ORDER' },
    { name: 'CREATE_MENU' },
    { name: 'UPDATE_MENU' },
    { name: 'VIEW_MENU' },
    { name: 'DELETE_MENU' },
    { name: 'CREATE_SALE' },
    { name: 'MODIFY_SALE' },
    { name: 'VIEW_SALE' },
    { name: 'CREATE_USER' },
    { name: 'VIEW_USER' },
    { name: 'VIEW_USERS' },
    { name: 'DELETE_USER' },
    { name: 'BLOCK_USER' },
  ]);

  await RolePermission.bulkCreate([
    { roleId: 1, permissionId: 1 },
    { roleId: 1, permissionId: 2 },
    { roleId: 1, permissionId: 3 },
    { roleId: 1, permissionId: 5 },

    { roleId: 2, permissionId: 1 },
    { roleId: 2, permissionId: 5 },
    { roleId: 2, permissionId: 6 },
    { roleId: 2, permissionId: 13 },

    { roleId: 3, permissionId: 1 },
    { roleId: 3, permissionId: 3 },
    { roleId: 3, permissionId: 5 },
    { roleId: 3, permissionId: 9 },
    { roleId: 3, permissionId: 13 },

    { roleId: 4, permissionId: 1 },
    { roleId: 4, permissionId: 4 },
    { roleId: 4, permissionId: 7 },
    { roleId: 4, permissionId: 8 },
    { roleId: 4, permissionId: 9 },
    { roleId: 4, permissionId: 10 },
    { roleId: 4, permissionId: 11 },
    { roleId: 4, permissionId: 12 },
    { roleId: 4, permissionId: 13 },

    { roleId: 5, permissionId: 1 },
    { roleId: 5, permissionId: 2 },
    { roleId: 5, permissionId: 3 },
    { roleId: 5, permissionId: 4 },
    { roleId: 5, permissionId: 5 },
    { roleId: 5, permissionId: 6 },
    { roleId: 5, permissionId: 7 },
    { roleId: 5, permissionId: 8 },
    { roleId: 5, permissionId: 9 },
    { roleId: 5, permissionId: 10 },
    { roleId: 5, permissionId: 11 },
    { roleId: 5, permissionId: 12 },
    { roleId: 5, permissionId: 13 },
    { roleId: 5, permissionId: 14 },
    { roleId: 5, permissionId: 15 },
    { roleId: 5, permissionId: 16 },
    { roleId: 5, permissionId: 17 },
    { roleId: 5, permissionId: 18 },
  ]);
});

afterAll(async () => {
  await sequelize.close();
});
