import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

export type DropOffType = 'Hand it to me' | 'Leave it at my door';

class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
> {
  declare addressId: CreationOptional<number>;

  declare placeId: string;

  declare suite: CreationOptional<string | null>;

  declare name: string;

  declare address: string;

  declare streetNumber: CreationOptional<string | null>;

  declare street: CreationOptional<string | null>;

  declare city: CreationOptional<string | null>;

  declare state: CreationOptional<string | null>;

  declare zipCode: CreationOptional<string | null>;

  declare lat: number;

  declare lng: number;

  declare dropOffOption: CreationOptional<DropOffType>;

  declare instructions: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Address.init(
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

    streetNumber: DataTypes.STRING,

    street: DataTypes.STRING,

    city: DataTypes.STRING,

    state: DataTypes.STRING,

    zipCode: {
      type: DataTypes.STRING,
      validate: { len: [5, 5] },
    },

    lat: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false,
    },

    lng: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
    },

    dropOffOption: {
      type: DataTypes.ENUM('Hand it to me', 'Leave it at my door'),
      allowNull: false,
      defaultValue: 'Leave it at my door',
    },

    instructions: DataTypes.TEXT,

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
  },
);

export default Address;
