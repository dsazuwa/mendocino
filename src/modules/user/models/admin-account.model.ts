/* eslint-disable no-param-reassign */

import { compareSync, hash } from 'bcryptjs';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

class AdminAccount extends Model<
  InferAttributes<AdminAccount>,
  InferCreationAttributes<AdminAccount>
> {
  declare adminId: number;

  declare emailId: number;

  declare password: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  public static async hashPassword(customer: AdminAccount) {
    if (!customer.changed('password')) return;

    try {
      const hashed = await hash(customer.password, 10);
      customer.password = hashed;
    } catch (err) {
      throw ApiError.internal('Failed to hash password');
    }
  }

  public static comparePasswords(password: string, hashed: string) {
    return compareSync(password, hashed);
  }
}

AdminAccount.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    emailId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
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
    tableName: TABLENAMES.ADMIN_ACCOUNT,
    hooks: {
      beforeSave: AdminAccount.hashPassword,
    },
  },
);

export default AdminAccount;
