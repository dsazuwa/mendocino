import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

class Category extends Model<
  InferAttributes<Category>,
  InferCreationAttributes<Category>
> {
  declare categoryId: CreationOptional<number>;

  declare sortOrder: number;

  declare name: string;

  declare menuDescription: CreationOptional<string | null>;

  declare orderDescription: CreationOptional<string | null>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Category.init(
  {
    categoryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sortOrder: {
      type: DataTypes.NUMBER,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    menuDescription: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    orderDescription: {
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
    tableName: TABLENAMES.MENU_CATEGORY,
  },
);

export default Category;
