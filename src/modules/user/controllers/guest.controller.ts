import { NextFunction, Request, Response } from 'express';

import guestService from '../services/guest.service';
import messages from '../utils/messages';

const getGuestId = (req: Request) => {
  const { cookie } = req.headers;

  if (cookie) {
    const cookies = cookie.split(';');

    const guestCookie = cookies.find((cookieStr) => {
      const [name] = cookieStr.trim().split('=');
      return name === 'guest-session';
    });

    if (guestCookie) {
      const [, value] = guestCookie.trim().split('=');
      return value;
    }
  }

  return undefined;
};

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const guestId = getGuestId(req);

    if (guestId === undefined) return res.status(400);

    const addresses = await guestService.getAddresses(guestId);

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
    const guestId = getGuestId(req);

    const { suite, placeId, name, address, zipCode, lat, lng } = req.body;

    const result = await guestService.createAddress(guestId, {
      suite,
      placeId,
      name,
      address,
      zipCode,
      lat,
      lng,
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
    const guestId = getGuestId(req);

    if (guestId === undefined) return res.status(400);

    const { id } = req.params;
    const { suite, placeId, name, address, zipCode, lat, lng } = req.body;

    const result = await guestService.updateAddress(guestId, parseInt(id, 10), {
      suite,
      placeId,
      name,
      address,
      zipCode,
      lat,
      lng,
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
    const guestId = getGuestId(req);
    const { id } = req.params;

    if (guestId === undefined) return res.status(400);

    const result = await guestService.deleteAddress(guestId, parseInt(id, 10));

    if (result === 1)
      res.status(200).json({ message: messages.DELETE_ADDRESS_SUCCESS });
    else res.status(400).json({ message: messages.DELETE_ADDRESS_FAIL });
  } catch (e) {
    next(e);
  }
};
