import { randomBytes } from 'crypto';
import { compareSync, hash } from 'bcryptjs';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';
import { ApiError } from '@App/utils';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

export type AdminOTPType = 'email' | 'password' | 'phone' | 'login';

class AdminOTP extends Model<
  InferAttributes<AdminOTP>,
  InferCreationAttributes<AdminOTP>
> {
  declare otpId: CreationOptional<number>;

  declare adminId: number;

  declare type: AdminOTPType;

  declare password: string;

  declare expiresAt: Date;

  /* eslint-disable no-param-reassign */
  public static async hashPassword(otp: AdminOTP) {
    if (!otp.changed('password')) return;

    try {
      const hashed = await hash(otp.password, 10);
      otp.password = hashed;
    } catch (err) {
      throw ApiError.internal('Failed to hash password');
    }
  }

  comparePasswords(password: string) {
    return compareSync(password, this.password);
  }

  public static generatePassword() {
    const code = randomBytes(2).readUIntBE(0, 2) % 100000;
    return code.toString().padStart(5, '0');
  }

  public static getExpiration() {
    return new Date(new Date().getTime() + 30 * 60000);
  }
}

AdminOTP.init(
  {
    otpId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    adminId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('email', 'password', 'phone', 'login'),
      unique: 'compositeIndex',
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    schema: USER_SCHEMA,
    tableName: TABLENAMES.ADMIN_OTP,
    hooks: {
      beforeSave: AdminOTP.hashPassword,
    },
  },
);

export default AdminOTP;
