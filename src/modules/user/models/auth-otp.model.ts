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

export type AuthOTPType = 'verify' | 'recover';

class AuthOTP extends Model<
  InferAttributes<AuthOTP>,
  InferCreationAttributes<AuthOTP>
> {
  declare id: CreationOptional<number>;

  declare userId: CreationOptional<number>;

  declare type: AuthOTPType;

  declare password: string;

  declare expiresAt: Date;

  /* eslint-disable no-param-reassign */
  public static async hashPassword(otp: AuthOTP) {
    if (!otp.changed('password')) return;

    try {
      const hashed = await hash(otp.password, 10);
      otp.password = hashed;
    } catch (err) {
      throw new Error('Failed to hash password');
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

AuthOTP.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('verify', 'recover'),
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
    tableName: 'auth_otps',
    timestamps: false,
    hooks: {
      beforeSave: AuthOTP.hashPassword,
    },
  },
);

export default AuthOTP;
