import Cart from './Cart';
import { Menu, MenuCategoryType, MenuMenuTag, MenuStatusType, MenuTag } from './Menu';
import { Order, OrderItem, OrderStatusType } from './Order';
import { Address, Token, TokenType, User, UserRoleType, UserStatusType } from './User';

User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Cart.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

Cart.belongsTo(Menu, { foreignKey: 'menuId', onDelete: 'CASCADE' });
Menu.hasMany(Cart, { foreignKey: 'menuId', onDelete: 'CASCADE' });

User.hasMany(Order, { foreignKey: 'userId', onDelete: 'SET NULL' });
Order.belongsTo(User, { foreignKey: 'userId', onDelete: 'SET NULL' });

Menu.hasMany(OrderItem, { foreignKey: 'menuId', onDelete: 'SET NULL' });
OrderItem.belongsTo(Menu, { foreignKey: 'menuId', onDelete: 'SET NULL' });

export {
  Address,
  Cart,
  Menu,
  MenuCategoryType,
  MenuMenuTag,
  MenuStatusType,
  MenuTag,
  Order,
  OrderItem,
  OrderStatusType,
  Token,
  TokenType,
  User,
  UserRoleType,
  UserStatusType,
};
