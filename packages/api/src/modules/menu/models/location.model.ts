import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { MENU_SCHEMA, TABLENAMES } from '../utils.ts/constants';

class Location extends Model<
  InferAttributes<Location>,
  InferCreationAttributes<Location>
> {
  declare locationId: CreationOptional<number>;

  declare placeId: string;

  declare name: string;

  declare phoneNumber: string;

  declare address: string;

  declare city: string;

  declare state: string;

  declare zipCode: string;

  declare lat: number;

  declare lng: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Location.init(
  {
    locationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    placeId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },

    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 10],
      },
    },

    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },

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

    lat: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false,
    },

    lng: {
      type: DataTypes.DECIMAL(9, 6),
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
    schema: MENU_SCHEMA,
    tableName: TABLENAMES.LOCATION,
  },
);

export default Location;
