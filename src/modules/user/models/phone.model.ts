import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

class Phone extends Model<
  InferAttributes<Phone>,
  InferCreationAttributes<Phone>
> {
  declare phoneId: CreationOptional<number>;

  declare phoneNumber: string;

  declare createdAt: CreationOptional<Date>;
}

Phone.init(
  {
    phoneId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [10, 10],
      },
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
    tableName: TABLENAMES.PHONE,
  },
);

export default Phone;
