import sequelize from '@App/db';

import { Role } from '@user/models';
import { ROLES } from '@user/utils/constants';

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await Role.bulkCreate([
    ROLES.CUSTOMER,
    ROLES.DELIVERY_DRIVER,
    ROLES.CUSTOMER_SUPPORT,
    ROLES.MANAGER,
    ROLES.ADMIN,
    ROLES.ROOT,
  ]);
});

afterAll(async () => {
  await sequelize.close();
});
