import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

export type AdminPhoneStatusType = 'active' | 'pending';

class AdminPhone extends Model<
  InferAttributes<AdminPhone>,
  InferCreationAttributes<AdminPhone>
> {
  declare adminId: number;

  declare phoneId: number;

  declare status: AdminPhoneStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

AdminPhone.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    phoneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'pending'),
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
    schema: USER_SCHEMA,
    tableName: TABLENAMES.ADMIN_PHONE,
  },
);

export default AdminPhone;
