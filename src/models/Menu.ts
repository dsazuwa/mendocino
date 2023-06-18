import {
  BelongsToManyAddAssociationMixin,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyRemoveAssociationMixin,
  BelongsToManyRemoveAssociationsMixin,
  CreationOptional, DataTypes,
  InferAttributes, InferCreationAttributes, Model,
} from "sequelize";
import sequelize from "../db";

type MenuCategoryType = '1/2 sandwich combos' | 'bowls' | 'craveable classics' | 'deli sides' | 'kids' | 'salads' | 'sandwiches' | 'soup';
type MenuStatusType = 'available' | 'out of stock' | 'discontinued' | 'special' | 'coming soon';

class MenuItem extends Model<InferAttributes<MenuItem>, InferCreationAttributes<MenuItem>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare description: string;
  declare category: MenuCategoryType;
  declare status: MenuStatusType;
  declare photoUrl: string;
  declare price: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare addMenuTag: BelongsToManyAddAssociationMixin<MenuTag, MenuTag['id']>;
  declare addMenuTags: BelongsToManyAddAssociationsMixin<MenuTag, MenuTag['id']>;
  declare getMenuTags: BelongsToManyGetAssociationsMixin<MenuTag>;
  declare removeMenuTag: BelongsToManyRemoveAssociationMixin<MenuTag, MenuTag['id']>;
  declare removeMenuTags: BelongsToManyRemoveAssociationsMixin<MenuTag, MenuTag['id']>;

  declare public static readonly tableName = 'menu_items';
}

MenuItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1, 50],
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
      },
    },
    category: {
      type: DataTypes.ENUM(
        '1/2 sandwich combos', 'bowls', 'craveable classics', 'deli sides', 'kids', 'salads', 'sandwiches', 'soup',
      ),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'available', 'out of stock', 'discontinued', 'special', 'coming soon',
      ),
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'Price must be a positive value.',
        },
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: MenuItem.tableName,
    underscored: true,
  },
);

class MenuTag extends Model<InferAttributes<MenuTag>, InferCreationAttributes<MenuTag>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare public static readonly tableName = 'menu_tags';
}

MenuTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: MenuTag.tableName,
    underscored: true,
  },
);

class MenuItemTag extends Model<InferAttributes<MenuItemTag>, InferCreationAttributes<MenuItemTag>> {
  declare menuItemId: number;
  declare menuTagId: number;

  declare public static readonly tableName = 'menu_items_tags';
}

MenuItemTag.init(
  {
    menuItemId: DataTypes.INTEGER,
    menuTagId: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: MenuItemTag.tableName,
    underscored: true,
    timestamps: false,
  },
);

MenuItem.belongsToMany(MenuTag, { through: MenuItemTag, foreignKey: 'menuItemId' });
MenuTag.belongsToMany(MenuItem, { through: MenuItemTag, foreignKey: 'menuTagId' });

export { MenuCategoryType, MenuStatusType, MenuItem, MenuItemTag, MenuTag };
