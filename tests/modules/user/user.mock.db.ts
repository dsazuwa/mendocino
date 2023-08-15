import sequelize from '@App/db';

import { Permission, Role, RolePermission } from '@user/models';
import {
  permissionConstants,
  roleConstants,
  rolePermissionConstants,
} from '@user/utils/constants';

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
    permissionConstants.CREATE_ADMIN,
    permissionConstants.CREATE_MANAGER,
    permissionConstants.CREATE_CUSTOMER_SERVICE,
    permissionConstants.CREATE_DELIVERY_DRIVER,
  ]);

  await RolePermission.bulkCreate(rolePermissionConstants);
});

afterAll(async () => {
  await sequelize.close();
});
