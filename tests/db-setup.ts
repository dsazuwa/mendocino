import sequelize from '@App/db';

import {
  Category,
  CategoryDiscount,
  Discount,
  Item,
  ItemCategory,
  ItemDiscount,
  ItemPrice,
  ItemTag,
  Size,
  Tag,
} from '@menu/models';

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
  // Menu
  await CategoryDiscount.destroy({ where: {} });

  await ItemDiscount.destroy({ where: {} });
  await ItemPrice.destroy({ where: {} });
  await ItemTag.destroy({ where: {} });
  await ItemCategory.destroy({ where: {} });

  await Discount.destroy({ where: {} });
  await Size.destroy({ where: {} });
  await Category.destroy({ where: {} });
  await Tag.destroy({ where: {} });
  await Item.destroy({ where: {} });

  // User
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
