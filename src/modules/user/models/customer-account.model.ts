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

export type CustomerAccountStatusType =
  | 'active'
  | 'pending'
  | 'suspended'
  | 'disabled';

class CustomerAccount extends Model<
  InferAttributes<CustomerAccount>,
  InferCreationAttributes<CustomerAccount>
> {
  declare customerId: number;

  declare emailId: number;

  declare password: CreationOptional<string | null>;

  declare status: CustomerAccountStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  /* eslint-disable no-param-reassign */
  public static async hashPassword(customer: CustomerAccount) {
    if (!customer.changed('password') || !customer.password) return;

    try {
      const hashed = await hash(customer.password, 10);
      customer.password = hashed;
    } catch (err) {
      throw ApiError.internal('Failed to hash password');
    }
  }

  comparePasswords(password: string) {
    if (!this.password) return false;

    return compareSync(password, this.password);
  }
}

CustomerAccount.init(
  {
    customerId: {
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
    },
    status: {
      type: DataTypes.ENUM('active', 'pending', 'suspended', 'disabled'),
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
    tableName: TABLENAMES.CUSTOMER_ACCOUNT,
    hooks: {
      beforeSave: CustomerAccount.hashPassword,
    },
  },
);

export default CustomerAccount;
