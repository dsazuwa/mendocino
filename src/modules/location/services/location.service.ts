import { Client, UnitSystem } from '@googlemaps/google-maps-services-js';
import { QueryTypes } from 'sequelize';

import sequelize from '@app/db';
import { LocationView } from '../types';

const locationService = {
  getAllLocations: (): Promise<LocationView> => {
    const query = 'SELECT * FROM menu.location_view;';

    return sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  },

  getLocation: async (name: string) => {
    const query = `
      SELECT
        l.place_id AS "placeId",
        l.name,
        l.phone_number AS "phoneNumber",
        l.address,
        l.city,
        l.state,
        l.zip_code AS "zipCode",
        l.lat,
        l.lng,
        ARRAY_AGG(
          JSONB_BUILD_OBJECT(
            'day', h.day_of_week,
            'open', h.open_time,
            'close', h.close_time
          ) ORDER BY
              CASE
                WHEN h.day_of_week = 'Sunday' THEN 1
                WHEN h.day_of_week = 'Monday' THEN 2
                WHEN h.day_of_week = 'Tuesday' THEN 3
                WHEN h.day_of_week = 'Wednesday' THEN 4
                WHEN h.day_of_week = 'Thursday' THEN 5
                WHEN h.day_of_week = 'Friday' THEN 6
                ELSE 7
              END
        ) AS hours
      FROM menu.locations l
      JOIN menu.location_hours h ON h.location_id = l.location_id
      WHERE l.name = $name
      GROUP BY l.location_id;
    `;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { name },
    })) as {
      placeId: string;
      name: string;
      phoneNumber: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      lat: number;
      lng: number;
      hours: { day: string; open: Date; close: Date }[];
    }[];

    return result.length === 0 ? undefined : result[0];
  },

  getClosestLocations: async (placeId: string, locations: LocationView) => {
    const origins = `place_id:${placeId}`;

    const destinations = locations
      .map((location) => `place_id:${location.placeId}`)
      .join('|');

    const client = new Client({});

    const {
      data: { rows, error_message: errorMessage },
    } = await client.distancematrix({
      params: {
        key: process.env.GOOGLE_PLACES_API_KEY as string,
        origins: [origins],
        destinations: [destinations],
        units: UnitSystem.imperial,
      },
    });

    if (errorMessage || rows.length === 0) return [];

    return rows[0].elements
      .map((element, i) => ({ ...locations[i], ...element }))
      .filter((element) => element.distance.value <= 56326.9)
      .sort((a, b) => a.distance.value - b.distance.value); // within 35 miles
  },

  getLocationMenu: async (name: string) => {
    const query = `SELECT * FROM menu.get_order_menu($name);`;

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
      bind: { name },
    })) as CategoryItems<MenuItem>[];

    return result;
  },
};

export default locationService;
