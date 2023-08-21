import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

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

  declare status: CustomerAccountStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
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
  },
);

export default CustomerAccount;
