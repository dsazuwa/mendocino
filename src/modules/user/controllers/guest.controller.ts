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
    const { session } = req.params;

    const addresses = await guestService.getAddresses(session);

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
    const { session } = req.params;

    const result = await guestService.createAddress(session, req.body);

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
    const { id, session } = req.params;

    const result = await guestService.updateAddress(
      session,
      parseInt(id, 10),
      req.body,
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
    const { id, session } = req.params;

    const result = await guestService.deleteAddress(session, parseInt(id, 10));

    if (result === 1)
      res.status(200).json({ message: messages.DELETE_ADDRESS_SUCCESS });
    else res.status(400).json({ message: messages.DELETE_ADDRESS_FAIL });
  } catch (e) {
    next(e);
  }
};
