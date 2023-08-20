import sequelize from '@App/db';

import {
  Address,
  Admin,
  AdminAccount,
  AdminOTP,
  AdminPhone,
  AdminRole,
  Customer,
  CustomerAccount,
  CustomerIdentity,
  CustomerOTP,
  CustomerPhone,
  Email,
  Phone,
  Role,
} from '@user/models';

beforeAll(async () => {
  await Address.destroy({ where: {} });

  await AdminRole.destroy({ where: {} });
  await AdminPhone.destroy({ where: {} });
  await AdminOTP.destroy({ where: {} });
  await AdminAccount.destroy({ where: {} });
  await Admin.destroy({ where: {} });

  await CustomerPhone.destroy({ where: {} });
  await CustomerOTP.destroy({ where: {} });
  await CustomerIdentity.destroy({ where: {} });
  await CustomerAccount.destroy({ where: {} });
  await Customer.destroy({ where: {} });

  await Email.destroy({ where: {} });
  await Phone.destroy({ where: {} });
  await Role.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});
