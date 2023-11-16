import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class CustomerEmail extends Model<
  InferAttributes<CustomerEmail>,
  InferCreationAttributes<CustomerEmail>
> {
  declare customerId: number;

  declare emailId: number;

  declare createdAt: CreationOptional<Date>;
}

CustomerEmail.init(
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    schema: USER_SCHEMA,
    tableName: TABLENAMES.CUSTOMER_EMAIL,
    timestamps: true,
    updatedAt: false,
  },
);

export default CustomerEmail;
