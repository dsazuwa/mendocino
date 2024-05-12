import sequelize from '@app/db';
import {
  Category,
  CategoryDiscount,
  Discount,
  Item,
  ItemCategory,
  ItemDiscount,
  ItemPrice,
  ItemTag,
  Tag,
} from '@app/modules/menu/models';
import {
  Address,
  Admin,
  AdminAccount,
  AdminOTP,
  AdminPhone,
  AdminRefreshToken,
  AdminRole,
  Customer,
  CustomerEmail,
  CustomerIdentity,
  CustomerOTP,
  CustomerPassword,
  CustomerPhone,
  CustomerRefreshToken,
  Email,
  Phone,
  Role,
} from '@app/modules/user/models';

beforeAll(async () => {
  // Menu
  await CategoryDiscount.destroy({ where: {} });

  await ItemDiscount.destroy({ where: {} });
  await ItemPrice.destroy({ where: {} });
  await ItemTag.destroy({ where: {} });
  await ItemCategory.destroy({ where: {} });

  await Discount.destroy({ where: {} });
  await Category.destroy({ where: {} });
  await Tag.destroy({ where: {} });
  await Item.destroy({ where: {} });

  // User
  await Address.destroy({ where: {} });

  await AdminRefreshToken.destroy({ where: {} });
  await AdminRole.destroy({ where: {} });
  await AdminPhone.destroy({ where: {} });
  await AdminOTP.destroy({ where: {} });
  await AdminAccount.destroy({ where: {} });
  await Admin.destroy({ where: {} });

  await CustomerPhone.destroy({ where: {} });
  await CustomerRefreshToken.destroy({ where: {} });
  await CustomerOTP.destroy({ where: {} });
  await CustomerIdentity.destroy({ where: {} });
  await CustomerPassword.destroy({ where: {} });
  await CustomerEmail.destroy({ where: {} });
  await Customer.destroy({ where: {} });

  await Email.destroy({ where: {} });
  await Phone.destroy({ where: {} });
  await Role.destroy({ where: {} });
});

afterAll(async () => {
  await sequelize.close();
});
