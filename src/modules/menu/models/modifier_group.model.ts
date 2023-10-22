import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

class ModifierGroup extends Model<
  InferAttributes<ModifierGroup>,
  InferCreationAttributes<ModifierGroup>
> {
  declare groupId: CreationOptional<number>;

  declare name: string;

  declare isRequired: boolean;

  declare allowMultipleSelections: boolean;

  declare minSelection: CreationOptional<number | null>;

  declare maxSelection: CreationOptional<number | null>;

  declare maxFree: CreationOptional<number | null>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

ModifierGroup.init(
  {
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    allowMultipleSelections: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    minSelection: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: null,
    },
    maxSelection: {
      type: DataTypes.NUMBER,
      allowNull: true,
      defaultValue: null,
    },
    maxFree: {
      type: DataTypes.NUMBER,
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
    tableName: TABLENAMES.MODIFIER_GROUP,
  },
);

export default ModifierGroup;
