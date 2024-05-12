import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { MENU_SCHEMA, TABLENAMES } from '../utils.ts/constants';

export type ItemMenuStatusType = 'active' | 'coming soon' | 'inactive';

class Item extends Model<InferAttributes<Item>, InferCreationAttributes<Item>> {
  declare itemId: CreationOptional<number>;

  declare sortOrder: number;

  declare isOnPublicMenu: boolean;

  declare name: string;

  declare description: string;

  declare status: ItemMenuStatusType;

  declare photoUrl: string;

  declare notes: CreationOptional<string | null>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Item.init(
  {
    itemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sortOrder: {
      type: DataTypes.NUMBER,
      unique: true,
      allowNull: false,
    },
    isOnPublicMenu: {
      type: DataTypes.BOOLEAN,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'coming soon', 'inactive'),
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    schema: MENU_SCHEMA,
    tableName: TABLENAMES.MENU_ITEM,
  },
);

export default Item;
