import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class Email extends Model<
  InferAttributes<Email>,
  InferCreationAttributes<Email>
> {
  declare emailId: CreationOptional<number>;

  declare email: string;

  declare createdAt: CreationOptional<Date>;
}

Email.init(
  {
    emailId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
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
    tableName: TABLENAMES.EMAIL,
  },
);

export default Email;
