import { QueryTypes } from 'sequelize';

import sequelize from '@app/db';
import { NextFunction, Request, Response } from 'express';
import { DistanceMatrixResponse, LocationView } from './types';

export const getClosestLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { placeId } = req.params;

    const query = 'SELECT * FROM menu.location_view;';

    const result = (await sequelize.query(query, {
      type: QueryTypes.SELECT,
    })) as LocationView;

    const origins = `place_id:${placeId}`;
    const destinations = result
      .map((location) => `place_id:${location.placeId}`)
      .join('|');

    const url = encodeURIComponent(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${process.env.GOOGLE_PLACES_API_KEY}&departure_time=now&units=imperial`,
    );

    const response = await fetch(url);

    const { rows, error_message: errorMessage } =
      (await response.json()) as DistanceMatrixResponse;

    if (errorMessage || rows.length === 0)
      res.status(200).json({ locations: [] });

    const locations = rows[0].elements
      .map((element, i) => ({ ...result[i], ...element }))
      .filter((element) => element.distance.value <= 56326.9); // within 35 miles

    res.status(200).json({ locations });
  } catch (e) {
    next(e);
  }
};
