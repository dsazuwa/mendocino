import { NextFunction, Request, Response } from 'express';

import guestService from '../services/guest.service';
import messages from '../utils/messages';

export const createGuest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const sessionId = await guestService.createGuest();

    res.status(200).json({ sessionId });
  } catch (e) {
    next(e);
  }
};

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const addresses = await guestService.getAddresses(id);

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
    const { id } = req.params;

    const { suite, placeId, name, address } = req.body;

    const result = await guestService.createAddress(id, {
      suite,
      placeId,
      name,
      address,
    });

    if (result)
      res
        .status(200)
        .json({ message: messages.CREATE_ADDRESS_SUCCESS, guestId: result });
    else
      res
        .status(400)
        .json({ message: messages.CREATE_ADDRESS_FAIL, guestId: null });
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
    const { guestId } = req.body;

    const { id } = req.params;
    const { suite, placeId, name, address } = req.body;

    const result = await guestService.updateAddress(guestId, parseInt(id, 10), {
      suite,
      placeId,
      name,
      address,
    });

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
    const { id } = req.params;
    const { guestId } = req.body;

    const result = await guestService.deleteAddress(guestId, parseInt(id, 10));

    if (result === 1)
      res.status(200).json({ message: messages.DELETE_ADDRESS_SUCCESS });
    else res.status(400).json({ message: messages.DELETE_ADDRESS_FAIL });
  } catch (e) {
    next(e);
  }
};
