import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  literal,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

class Admin extends Model<
  InferAttributes<Admin>,
  InferCreationAttributes<Admin>
> {
  declare adminId: CreationOptional<number>;

  declare firstName: string;

  declare lastName: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

Admin.init(
  {
    adminId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      defaultValue: literal("nextval('users.admin_id_seq')"),
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
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
    schema: USER_SCHEMA,
    tableName: TABLENAMES.ADMIN,
  },
);

export default Admin;
