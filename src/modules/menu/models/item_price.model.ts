import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

class ItemPrice extends Model<
  InferAttributes<ItemPrice>,
  InferCreationAttributes<ItemPrice>
> {
  declare priceId: CreationOptional<number>;

  declare itemId: number;

  declare basePrice: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

ItemPrice.init(
  {
    priceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
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
    tableName: TABLENAMES.MENU_ITEM_PRICE,
  },
);

export default ItemPrice;
