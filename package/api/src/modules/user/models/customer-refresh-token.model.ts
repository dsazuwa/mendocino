/* eslint-disable no-param-reassign */

import { compareSync, hash } from 'bcryptjs';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { ApiError } from '../../../utils';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class CustomerRefreshToken extends Model<
  InferAttributes<CustomerRefreshToken>,
  InferCreationAttributes<CustomerRefreshToken>
> {
  declare tokenId: CreationOptional<number>;

  declare customerId: number;

  declare token: string;

  declare expiresAt: Date;

  declare createdAt: CreationOptional<Date>;

  public static async hashToken(data: CustomerRefreshToken) {
    if (!data.changed('token')) return;

    try {
      const hashed = await hash(data.token, 10);
      data.token = hashed;
    } catch (err) {
      throw ApiError.internal('Failed to hash token');
    }
  }

  public static compareTokens(token: string, hashed: string) {
    return compareSync(token, hashed);
  }
}

CustomerRefreshToken.init(
  {
    tokenId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: 'compositeIndex',
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: 'compositeIndex',
    },
    expiresAt: {
      type: DataTypes.DATE,
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
    timestamps: true,
    updatedAt: false,
    schema: USER_SCHEMA,
    tableName: TABLENAMES.CUSTOMER_REFRESH_TOKEN,
    hooks: {
      beforeSave: CustomerRefreshToken.hashToken,
    },
  },
);

export default CustomerRefreshToken;
