import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { MENU_SCHEMA, TABLENAMES } from '@menu/utils.ts/constants';

class ModifierGroupParent extends Model<
  InferAttributes<ModifierGroupParent>,
  InferCreationAttributes<ModifierGroupParent>
> {
  declare parent: number;

  declare child: number;

  declare price: CreationOptional<string | null>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

ModifierGroupParent.init(
  {
    parent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'parent_group_id',
    },
    child: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'child_group_id',
    },
    price: {
      type: DataTypes.DECIMAL(4),
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
    tableName: TABLENAMES.MODIFIER_GROUP_PARENT,
  },
);

export default ModifierGroupParent;
