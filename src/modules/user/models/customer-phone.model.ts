import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

export type CustomerPhoneStatusType = 'active' | 'pending';

class CustomerPhone extends Model<
  InferAttributes<CustomerPhone>,
  InferCreationAttributes<CustomerPhone>
> {
  declare customerId: number;

  declare phoneId: number;

  declare status: CustomerPhoneStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

CustomerPhone.init(
  {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    phoneId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
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
    tableName: TABLENAMES.CUSTOMER_PHONE,
  },
);

export default CustomerPhone;
