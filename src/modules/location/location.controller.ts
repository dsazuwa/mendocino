import { NextFunction, Request, Response } from 'express';
import locationService from './services/location.service';

export const getClosestLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { placeId } = req.params;

    const locations = await locationService.getAllLocations();

    const result = await locationService.getClosestLocations(
      placeId,
      locations,
    );

    res.status(200).json({ locations: result });
  } catch (e) {
    next(e);
  }
};

export const getLocations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const locations = await locationService.getAllLocations();

    return res.status(200).json({ locations });
  } catch (e) {
    next(e);
  }
};

export const getLocationMenu = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name } = req.params;

    const location = await locationService.getLocation(name);

    if (location === undefined)
      return res.status(404).json({ message: `Location (${name}) not found.` });

    const menu = await locationService.getLocationMenu(name);

    res.status(200).json({ ...location, menu });
  } catch (e) {
    next(e);
  }
};
