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

class CustomerPassword extends Model<
  InferAttributes<CustomerPassword>,
  InferCreationAttributes<CustomerPassword>
> {
  declare customerId: number;

  declare password: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  public static async hashPassword(password: CustomerPassword) {
    if (!password.changed('password')) return;

    try {
      const hashed = await hash(password.password, 10);
      password.password = hashed;
    } catch (err) {
      throw ApiError.internal('Failed to hash password');
    }
  }

  public static comparePasswords(password: string, hashed: string) {
    return compareSync(password, hashed);
  }
}

CustomerPassword.init(
  {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
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
    timestamps: true,
    schema: USER_SCHEMA,
    tableName: TABLENAMES.CUSTOMER_PASSWORD,
    hooks: {
      beforeSave: CustomerPassword.hashPassword,
    },
  },
);

export default CustomerPassword;
