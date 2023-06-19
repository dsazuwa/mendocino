import { compareSync, hash } from 'bcryptjs';
import { config } from 'dotenv';
import { sign } from 'jsonwebtoken';
import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';
import sequelize from '../db';

config();

type UserStatusType = 'active' | 'inactive' | 'pending';
type UserRoleType = 'admin' | 'client';

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

  declare addAddress: HasManyAddAssociationMixin<Address, Address['id']>;
  declare createAddress: HasManyCreateAssociationMixin<Address>;
  declare getAddresses: HasManyGetAssociationsMixin<Address>;
  declare removeAddress: HasManyRemoveAssociationMixin<Address, Address['id']>;
  declare removeAddresses: HasManyRemoveAssociationsMixin<Address, Address['id']>;

  public declare static readonly tableName = 'users';

  public static async hashPassword(user: User) {
    if (!user.changed('password')) return;

    try {
      const hashed = await hash(user.password, 10);
      user.password = hashed;
    } catch (err) {
      throw new Error('Failed to hash password');
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
          }
          if (value.length < 8) {
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
    tableName: User.tableName,
    underscored: true,
    hooks: {
      beforeSave: User.hashPassword,
    },
  },
);

class Address extends Model<InferAttributes<Address>, InferCreationAttributes<Address>> {
  declare id: CreationOptional<number>;
  declare userId: CreationOptional<number>;
  declare addressLine1: string;
  declare addressLine2: CreationOptional<string>;
  declare city: string;
  declare state: string;
  declare postalCode: string;
}

Address.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    addressLine1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addressLine2: DataTypes.STRING,
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: Address.tableName,
    underscored: true,
  },
);

User.hasMany(Address, { onDelete: 'CASCADE' });
Address.belongsTo(User, { onDelete: 'CASCADE' });

export { User, UserRoleType, UserStatusType, Address };
