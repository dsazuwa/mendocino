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
