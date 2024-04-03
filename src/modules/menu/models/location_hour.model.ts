import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import sequelize from '../../../db';
import { MENU_SCHEMA, TABLENAMES } from '../utils.ts/constants';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

class LocationHour extends Model<
  InferAttributes<LocationHour>,
  InferCreationAttributes<LocationHour>
> {
  declare locationId: CreationOptional<number>;

  declare dayOfWeek: DayOfWeek;

  declare openTime: string;

  declare closeTime: string;
}

LocationHour.init(
  {
    locationId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    dayOfWeek: {
      type: DataTypes.ENUM(
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ),
      allowNull: false,
    },

    openTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    closeTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    sequelize,
    underscored: true,
    schema: MENU_SCHEMA,
    tableName: TABLENAMES.LOCATION_HOURS,
  },
);

export default LocationHour;
