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

export type CustomerOTPType = 'email' | 'password' | 'phone';

class CustomerOTP extends Model<
  InferAttributes<CustomerOTP>,
  InferCreationAttributes<CustomerOTP>
> {
  declare otpId: CreationOptional<number>;

  declare customerId: number;

  declare type: CustomerOTPType;

  declare password: string;

  declare expiresAt: Date;

  /* eslint-disable no-param-reassign */
  public static async hashPassword(otp: CustomerOTP) {
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

CustomerOTP.init(
  {
    otpId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('email', 'password', 'phone'),
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
    tableName: TABLENAMES.CUSTOMER_OTP,
    hooks: {
      beforeSave: CustomerOTP.hashPassword,
    },
  },
);

export default CustomerOTP;
