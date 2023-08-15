import { compareSync, hash } from 'bcryptjs';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

export type UserAccountStatusType = 'active' | 'pending' | 'inactive';

class UserAccount extends Model<
  InferAttributes<UserAccount>,
  InferCreationAttributes<UserAccount>
> {
  declare userId: number;

  declare email: string;

  declare password: CreationOptional<string | null>;

  declare status: UserAccountStatusType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  /* eslint-disable no-param-reassign */
  public static async hashPassword(user: UserAccount) {
    if (!user.changed('password') || !user.password) return;

    try {
      const hashed = await hash(user.password, 10);
      user.password = hashed;
    } catch (err) {
      throw new Error('Failed to hash password');
    }
  }

  comparePasswords(password: string) {
    if (!this.password) return false;

    return compareSync(password, this.password);
  }
}

UserAccount.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'pending'),
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
    hooks: {
      beforeSave: UserAccount.hashPassword,
    },
  },
);

export default UserAccount;
