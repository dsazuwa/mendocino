import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

class AdminRefreshToken extends Model<
  InferAttributes<AdminRefreshToken>,
  InferCreationAttributes<AdminRefreshToken>
> {
  declare tokenId: CreationOptional<number>;

  declare adminId: number;

  declare token: string;

  declare revoked: boolean;

  declare expiresAt: Date;

  declare createdAt: CreationOptional<Date>;
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
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
  },
);

export default AdminRefreshToken;
