import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { MENU_SCHEMA, TABLENAMES } from '../utils.ts/constants';

export type ItemOrderStatusType =
  | 'available'
  | 'unavailable for today'
  | 'unavailable indefinitely';

class OrderItem extends Model<
  InferAttributes<OrderItem>,
  InferCreationAttributes<OrderItem>
> {
  declare locationId: number;

  declare itemId: number;

  declare status: ItemOrderStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

OrderItem.init(
  {
    locationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    itemId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM(
        'available',
        'unavailable for today',
        'unavailable indefinitely',
      ),
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
    tableName: TABLENAMES.ORDER_MENU_ITEM,
  },
);

export default OrderItem;
