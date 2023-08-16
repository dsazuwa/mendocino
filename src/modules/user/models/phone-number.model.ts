import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

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
  },
);

export default PhoneNumber;
