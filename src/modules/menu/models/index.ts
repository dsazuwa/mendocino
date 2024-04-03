import Category from './category.model';
import CategoryDiscount from './category_discount.model';
import Discount, { DiscountUnitType } from './discount.model';
import Item, { ItemMenuStatusType } from './item.model';
import ItemCategory from './item_category.model';
import ItemDiscount from './item_discount.model';
import ItemModifierGroup from './item_modifier_group.model';
import ItemPrice from './item_price.model';
import ItemTag from './item_tag.model';
import Location from './location.model';
import LocationHour, { DayOfWeek } from './location_hour.model';
import ModifierGroup from './modifier_group.model';
import ModifierGroupParent from './modifier_group_parent.model';
import ModifierOption, {
  ModifierOptionStatusType,
} from './modifier_option.model';
import OrderItem, { ItemOrderStatusType } from './order-item.model';
import Tag from './tag.model';

Location.hasMany(LocationHour, { foreignKey: 'locationId' });
LocationHour.belongsTo(Location, { foreignKey: 'locationId' });

OrderItem.belongsTo(Location, { foreignKey: 'location_id' });
OrderItem.belongsTo(Item, { foreignKey: 'item_id' });

Item.belongsToMany(Category, {
  through: ItemCategory,
  foreignKey: 'itemId',
});
Category.belongsToMany(Item, {
  through: ItemCategory,
  foreignKey: 'categoryId',
});

Item.belongsToMany(Tag, {
  through: ItemTag,
  foreignKey: 'itemId',
});
Tag.belongsToMany(Item, {
  through: ItemTag,
  foreignKey: 'tagId',
});

Item.hasMany(ItemPrice, { foreignKey: 'itemId' });
ItemPrice.belongsTo(Item, { foreignKey: 'itemId' });

ModifierGroup.hasMany(ModifierGroupParent, { foreignKey: 'parent' });
ModifierGroupParent.belongsTo(ModifierGroup, { foreignKey: 'parent' });
ModifierGroup.hasMany(ModifierGroupParent, { foreignKey: 'child' });
ModifierGroupParent.belongsTo(ModifierGroup, { foreignKey: 'child' });

ModifierOption.belongsTo(ModifierGroup, { foreignKey: 'groupId' });
ModifierGroup.hasMany(ModifierOption, { foreignKey: 'groupId' });

Item.belongsToMany(ModifierGroup, {
  through: ItemModifierGroup,
  foreignKey: 'itemId',
});
ModifierGroup.belongsToMany(Item, {
  through: ItemModifierGroup,
  foreignKey: 'groupId',
});

Discount.hasMany(ItemDiscount, { foreignKey: 'discountId' });
ItemDiscount.belongsTo(Discount, { foreignKey: 'discountId' });

Discount.hasMany(CategoryDiscount, { foreignKey: 'discountId' });
CategoryDiscount.belongsTo(Discount, { foreignKey: 'discountId' });

Item.hasOne(ItemDiscount, { foreignKey: 'itemId' });
ItemDiscount.belongsTo(Item, { foreignKey: 'itemId' });

Category.hasOne(CategoryDiscount, { foreignKey: 'categoryId' });
CategoryDiscount.belongsTo(Category, { foreignKey: 'categoryId' });

export {
  Category,
  CategoryDiscount,
  DayOfWeek,
  Discount,
  DiscountUnitType,
  Item,
  ItemCategory,
  ItemDiscount,
  ItemMenuStatusType,
  ItemModifierGroup,
  ItemOrderStatusType,
  ItemPrice,
  ItemTag,
  Location,
  LocationHour,
  ModifierGroup,
  ModifierGroupParent,
  ModifierOption,
  ModifierOptionStatusType,
  OrderItem,
  Tag,
};
