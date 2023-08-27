import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

export type DiscountUnitType = 'percentage' | 'amount';

class Discount extends Model<
  InferAttributes<Discount>,
  InferCreationAttributes<Discount>
> {
  declare discountId: CreationOptional<number>;

  declare value: string;

  declare unit: DiscountUnitType;

  declare minOrderValue: string;

  declare maxDiscountAmount: string;

  declare validFrom: Date;

  declare validUntil: Date;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Discount.init(
  {
    discountId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    value: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    unit: {
      type: DataTypes.ENUM('percentage', 'amount'),
      allowNull: false,
    },
    minOrderValue: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    maxDiscountAmount: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    validUntil: {
      type: DataTypes.DATE,
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
    tableName: TABLENAMES.MENU_DISCOUNT,
  },
);

export default Discount;
