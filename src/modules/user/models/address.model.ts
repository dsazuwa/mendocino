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

class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
> {
  declare addressId: CreationOptional<number>;

  declare customerId: number;

  declare addressLine1: string;

  declare addressLine2: CreationOptional<string | null>;

  declare city: string;

  declare state: string;

  declare zipCode: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  public static async enforceAddressLimit(
    address: Address,
    options?: SaveOptions,
  ) {
    const { transaction } = options || {};

    const addressCount = await Address.count({
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

Address.init(
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
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [5, 5],
      },
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
    tableName: TABLENAMES.ADDRESS,
    hooks: {
      beforeSave: Address.enforceAddressLimit,
    },
  },
);

export default Address;
