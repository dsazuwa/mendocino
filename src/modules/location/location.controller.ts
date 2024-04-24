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
    const { id } = req.params;

    const menu = await locationService.getLocationMenu(parseInt(id, 10));

    res.status(200).json({ menu });
  } catch (e) {
    next(e);
  }
};
