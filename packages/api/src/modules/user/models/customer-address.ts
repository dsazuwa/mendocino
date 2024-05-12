import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  SaveOptions,
  ValidationError,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class CustomerAddress extends Model<
  InferAttributes<CustomerAddress>,
  InferCreationAttributes<CustomerAddress>
> {
  declare addressId: CreationOptional<number>;

  declare customerId: number;

  declare createdAt: CreationOptional<Date>;

  public static async enforceAddressLimit(
    address: CustomerAddress,
    options?: SaveOptions,
  ) {
    const { transaction } = options || {};

    const addressCount = await CustomerAddress.count({
      where: { customerId: address.customerId },
      transaction,
    });

    if (addressCount === 5)
      throw new ValidationError(
        'User has reached the maximum address limit',
        [],
      );
  }
}

CustomerAddress.init(
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    updatedAt: false,
    schema: USER_SCHEMA,
    tableName: TABLENAMES.CUSTOMER_ADDRESS,
    hooks: {
      beforeSave: CustomerAddress.enforceAddressLimit,
    },
  },
);

export default CustomerAddress;
