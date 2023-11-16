import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

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
    schema: USER_SCHEMA,
    tableName: TABLENAMES.ROLE,
  },
);

export default Role;
