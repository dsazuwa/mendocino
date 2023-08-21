import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

import { TABLENAMES, USER_SCHEMA } from '@user/utils/constants';

export type ProviderType = 'google' | 'facebook';

class CustomerIdentity extends Model<
  InferAttributes<CustomerIdentity>,
  InferCreationAttributes<CustomerIdentity>
> {
  declare identityId: string;

  declare customerId: number;

  declare provider: ProviderType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

CustomerIdentity.init(
  {
    identityId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    provider: {
      type: DataTypes.ENUM('google', 'facebook'),
      primaryKey: true,
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
    tableName: TABLENAMES.CUSTOMER_IDENTITY,
  },
);

export default CustomerIdentity;
