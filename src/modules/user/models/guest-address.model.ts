import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  SaveOptions,
  ValidationError,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class GuestAddress extends Model<
  InferAttributes<GuestAddress>,
  InferCreationAttributes<GuestAddress>
> {
  declare addressId: CreationOptional<number>;

  declare guestId: string;

  declare createdAt: CreationOptional<Date>;

  public static async enforceAddressLimit(
    address: GuestAddress,
    options?: SaveOptions,
  ) {
    const { transaction } = options || {};

    const addressCount = await GuestAddress.count({
      where: { guestId: address.guestId },
      transaction,
    });

    if (addressCount === 5)
      throw new ValidationError(
        'User has reached the maximum address limit',
        [],
      );
  }
}

GuestAddress.init(
  {
    addressId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    guestId: {
      type: DataTypes.UUIDV4,
      allowNull: false,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    updatedAt: false,
    schema: USER_SCHEMA,
    tableName: TABLENAMES.GUEST_ADDRESS,
    hooks: {
      beforeSave: GuestAddress.enforceAddressLimit,
    },
  },
);

export default GuestAddress;
