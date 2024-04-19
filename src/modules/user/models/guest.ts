import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  UUID,
  UUIDV4,
} from 'sequelize';

import sequelize from '../../../db';
import { TABLENAMES, USER_SCHEMA } from '../utils/constants';

class Guest extends Model<
  InferAttributes<Guest>,
  InferCreationAttributes<Guest>
> {
  declare guestId: CreationOptional<string>;

  declare createdAt: CreationOptional<Date>;
}

Guest.init(
  {
    guestId: {
      type: UUID,
      primaryKey: true,
      defaultValue: UUIDV4,
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
    tableName: TABLENAMES.GUEST,
  },
);

export default Guest;
