import Cart from './Cart';
import { Menu, MenuCategoryType, MenuMenuTag, MenuStatusType, MenuTag } from './Menu';
import { Address, User, UserRoleType, UserStatusType } from './User';

User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

Cart.belongsTo(Menu, { foreignKey: 'menuId', onDelete: 'CASCADE' });
Menu.hasMany(Cart, { foreignKey: 'menuId', onDelete: 'CASCADE' });

export {
  Address,
  Cart,
  Menu,
  MenuCategoryType,
  MenuMenuTag,
  MenuStatusType,
  MenuTag,
  User,
  UserRoleType,
  UserStatusType,
};
