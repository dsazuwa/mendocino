import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission>
> {
  declare roleId: number;

  declare permissionId: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

RolePermission.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
    },
    permissionId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
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
  },
);

export default RolePermission;
