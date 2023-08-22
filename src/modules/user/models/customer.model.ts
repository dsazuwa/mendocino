import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  literal,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare customerId: CreationOptional<number>;

  declare firstName: string;

  declare lastName: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Customer.init(
  {
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: literal("nextval('users.customer_id_seq')"),
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
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
    tableName: TABLENAMES.CUSTOMER,
  },
);

export default Customer;
