import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

class UserRole extends Model<
  InferAttributes<UserRole>,
  InferCreationAttributes<UserRole>
> {
  declare userId: number;

  declare roleId: number;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

UserRole.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
    },
    roleId: {
      type: DataTypes.INTEGER,
      unique: 'compositeIndex',
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

export default UserRole;
