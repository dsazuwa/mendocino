import { NextFunction, Request, Response } from 'express';

import addressService from '../services/address.service';
import messages from '../utils/messages';

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    const addresses = await addressService.getAddresses(userId);

    res.status(200).json({ addresses });
  } catch (e) {
    next(e);
  }
};

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { suite, placeId, name, address, zipCode, lat, lng } = req.body;

    const result = await addressService.createAddress(userId, {
      suite,
      placeId,
      name,
      address,
      zipCode,
      lat,
      lng,
    });

    if (result)
      res.status(200).json({ message: messages.CREATE_ADDRESS_SUCCESS });
    else res.status(400).json({ message: messages.CREATE_ADDRESS_FAIL });
  } catch (e) {
    next(e);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { id } = req.params;
    const { suite, placeId, name, address, zipCode, lat, lng } = req.body;

    const result = await addressService.updateAddress(
      userId,
      parseInt(id, 10),
      {
        suite,
        placeId,
        name,
        address,
        zipCode,
        lat,
        lng,
      },
    );

    if (result === 1)
      res.status(200).json({ message: messages.UPDATE_ADDRESS_SUCCESS });
    else res.status(400).json({ message: messages.UPDATE_ADDRESS_FAIL });
  } catch (e) {
    next(e);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { id } = req.params;

    const result = await addressService.deleteAddress(userId, parseInt(id, 10));

    if (result === 1)
      res.status(200).json({ message: messages.DELETE_ADDRESS_SUCCESS });
    else res.status(400).json({ message: messages.DELETE_ADDRESS_FAIL });
  } catch (e) {
    next(e);
  }
};
