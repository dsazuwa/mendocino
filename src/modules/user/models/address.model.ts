import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  QueryTypes,
  ValidationError,
} from 'sequelize';

import sequelize from '@App/db';

import { ROLES, TABLENAMES } from '@user/utils/constants';

class Address extends Model<
  InferAttributes<Address>,
  InferCreationAttributes<Address>
> {
  declare addressId: CreationOptional<number>;

  declare userId: number;

  declare addressLine1: string;

  declare addressLine2: CreationOptional<string | null>;

  declare city: string;

  declare state: string;

  declare postalCode: string;

  declare createdAt: CreationOptional<Date>;

  declare updatedAt: CreationOptional<Date>;

  public static async enforceAddressLimitForCustomers(address: Address) {
    const query = `
      SELECT
        u.user_id AS "userId",
        array_agg(DISTINCT r.name) AS roles
      FROM
        ${TABLENAMES.USER} u
      JOIN
        ${TABLENAMES.USER_ROLE} ur ON u.user_id = ur.user_id
      JOIN
        ${TABLENAMES.ROLE} r ON r.role_id = ur.role_id
      WHERE
        u.user_id = ${address.userId}
      GROUP BY
        u.user_id;`;

    const result = await sequelize.query(query, { type: QueryTypes.SELECT });
    const user = result[0] as { userId: number; roles: string[] } | undefined;

    if (!user) throw new ValidationError('User not found', []);

    if (user.roles.length === 1 && user.roles[0] === ROLES.CUSTOMER.name) {
      const addressCount = await Address.count({
        where: { userId: user.userId },
      });

      if (addressCount === 5)
        throw new ValidationError(
          'User has reached the maximum address limit',
          [],
        );
    } else {
      throw new ValidationError('Non-customers cannot have addresses', []);
    }
  }
}

Address.init(
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
      validate: {
        len: [5, 5],
      },
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
    tableName: TABLENAMES.ADDRESS,
    hooks: {
      beforeSave: Address.enforceAddressLimitForCustomers,
    },
  },
);

export default Address;
