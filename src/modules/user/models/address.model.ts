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

  declare placeId: string;

  declare suite: CreationOptional<string | null>;

  declare name: string;

  declare address: string;

  declare zipCode: string;

  declare lat: string;

  declare lng: string;

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

    placeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    suite: DataTypes.STRING,

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { len: [5, 5] },
    },

    lat: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { max: 32 },
    },

    lng: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { max: 32 },
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
