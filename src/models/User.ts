import { compareSync, hash } from 'bcryptjs';
import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import sequelize from '../db';

config();

export type UserStatusType = 'active' | 'inactive' | 'pending';
export type UserRoleType = 'admin' | 'client';

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare uuid: string;
  declare firstName: string;
  declare lastName: string;
  declare email: string;
  declare password: string;
  declare role: CreationOptional<UserRoleType>;
  declare status: CreationOptional<UserStatusType>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  public declare static readonly tableName = 'users';

  public static async hashPassword(user: User) {
    if (!user.changed('password')) return;

    try {
      const hashed = await hash(user.password, 10);
      user.password = hashed;
    } catch (err) {
      throw new Error('Failed to hash password');
      // logger.error('Failed to hash password', err);
    }
  }

  comparePasswords(other: string) {
    return compareSync(other, this.password);
  }

  generateJWT() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT secret is not defined');
    }

    const payload = { uuid: this.uuid, email: this.email };
    return sign(payload, `${secret}`, { expiresIn: '60 days' });
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        // is: /^[\w\s]+$/,
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 255],
        // is: /^[\w\s]+$/,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isValid(value: string) {
          if (value.length > 50) {
            throw new Error('Password should bot exceed 50 character');
          } else if (value.length < 8) {
            throw new Error('Password should be at least 8 characters long');
          }
        },
      },
    },
    role: {
      type: DataTypes.ENUM('admin', 'client'),
      allowNull: false,
      defaultValue: 'client',
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
      allowNull: false,
      defaultValue: 'pending',
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'users',
    underscored: true,
    hooks: {
      beforeSave: User.hashPassword,
    },
  },
);

export default User;
