import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

export type ModifierOptionStatusType =
  | 'available'
  | 'unavailable for today'
  | 'unavailable indefinitely';

class ModifierOption extends Model<
  InferAttributes<ModifierOption>,
  InferCreationAttributes<ModifierOption>
> {
  declare optionId: CreationOptional<number>;

  declare groupId: number;

  declare name: string;

  declare price: CreationOptional<string | null>;

  declare status: ModifierOptionStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

ModifierOption.init(
  {
    optionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(4),
      allowNull: true,
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
    tableName: TABLENAMES.MODIFIER_OPTION,
  },
);

export default ModifierOption;
