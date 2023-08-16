import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES } from '@user/utils/constants';

class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare roleId: CreationOptional<number>;

  declare name: string;
}

Role.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    tableName: TABLENAMES.ROLE,
  },
);

export default Role;
