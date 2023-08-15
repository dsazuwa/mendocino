import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '@App/db';

export type ProviderType = 'google' | 'facebook';

class UserIdentity extends Model<
  InferAttributes<UserIdentity>,
  InferCreationAttributes<UserIdentity>
> {
  declare identityId: string;

  declare userId: number;

  declare provider: ProviderType;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;
}

UserIdentity.init(
  {
    identityId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
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
  },
);

export default UserIdentity;
