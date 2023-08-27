import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

class ItemDiscount extends Model<
  InferAttributes<ItemDiscount>,
  InferCreationAttributes<ItemDiscount>
> {
  declare itemId: number;

  declare discountId: number;

  declare createdAt: CreationOptional<Date>;
}

ItemDiscount.init(
  {
    itemId: {
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
    tableName: TABLENAMES.MENU_ITEM_DISCOUNT,
  },
);

ItemDiscount.removeAttribute('id');

export default ItemDiscount;
