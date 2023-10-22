import Category from './category.model';
import CategoryDiscount from './category_discount.model';
import Discount, { DiscountUnitType } from './discount.model';
import Item, { ItemOrderStatusType, ItemMenuStatusType } from './item.model';
import ItemCategory from './item_category.model';
import ItemDiscount from './item_discount.model';
import ItemPrice from './item_price.model';
import ItemTag from './item_tag.model';
import Tag from './tag.model';

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
  Discount,
  DiscountUnitType,
  Item,
  ItemCategory,
  ItemDiscount,
  ItemOrderStatusType,
  ItemPrice,
  ItemMenuStatusType,
  ItemTag,
  Tag,
};
