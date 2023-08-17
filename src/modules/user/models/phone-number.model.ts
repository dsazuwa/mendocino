import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ValidationError,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES } from '@user/utils/constants';

export type PhoneNumberStatusype = 'active' | 'pending';

class PhoneNumber extends Model<
  InferAttributes<PhoneNumber>,
  InferCreationAttributes<PhoneNumber>
> {
  declare phoneNumberId: CreationOptional<number>;

  declare userId: number;

  declare phoneNumber: string;

  declare status: PhoneNumberStatusype;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  public static async preventUpdatingNumber(instance: PhoneNumber) {
    if (instance.changed('phoneNumber'))
      throw new ValidationError(
        'Cannot update phone number directly. Delete and recreate the number.',
        [],
      );
  }
}

PhoneNumber.init(
  {
    phoneNumberId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
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
    status: {
      type: DataTypes.ENUM('active', 'pending'),
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
    tableName: TABLENAMES.PHONE_NUMBER,
    hooks: { beforeUpdate: PhoneNumber.preventUpdatingNumber },
  },
);

export default PhoneNumber;
