import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { MENU_SCHEMA, TABLENAMES } from '../utils.ts/constants';

class CategoryDiscount extends Model<
  InferAttributes<CategoryDiscount>,
  InferCreationAttributes<CategoryDiscount>
> {
  declare categoryId: number;

  declare discountId: number;

  declare createdAt: CreationOptional<Date>;
}

CategoryDiscount.init(
  {
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    updatedAt: false,
    schema: MENU_SCHEMA,
    tableName: TABLENAMES.MENU_CATEGORY_DISCOUNT,
  },
);

CategoryDiscount.removeAttribute('id');

export default CategoryDiscount;
