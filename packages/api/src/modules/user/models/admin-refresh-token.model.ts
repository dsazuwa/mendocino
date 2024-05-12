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

class AdminRefreshToken extends Model<
  InferAttributes<AdminRefreshToken>,
  InferCreationAttributes<AdminRefreshToken>
> {
  declare tokenId: CreationOptional<number>;

  declare adminId: number;

  declare token: string;

  declare expiresAt: Date;

  declare createdAt: CreationOptional<Date>;

  public static async hashToken(data: AdminRefreshToken) {
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

AdminRefreshToken.init(
  {
    tokenId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adminId: {
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
    tableName: TABLENAMES.ADMIN_REFRESH_TOKEN,
    hooks: {
      beforeSave: AdminRefreshToken.hashToken,
    },
  },
);

export default AdminRefreshToken;
