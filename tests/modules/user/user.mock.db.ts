import sequelize from '@App/db';

import { Role } from '@user/models';
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
});

afterAll(async () => {
  await sequelize.close();
});
