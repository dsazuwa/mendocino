import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class AdminRole extends Model<
  InferAttributes<AdminRole>,
  InferCreationAttributes<AdminRole>
> {
  declare adminId: number;

  declare roleId: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

AdminRole.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
    },
    roleId: {
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
    schema: USER_SCHEMA,
    tableName: TABLENAMES.ADMIN_ROLE,
  },
);

export default AdminRole;
