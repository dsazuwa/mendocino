import { NextFunction, Request, Response } from 'express';

import addressService from '@user/services/address.service';
import messages from '@user/utils/messages';

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
    const { addressLine1, addressLine2, city, state, postalCode } = req.body;

    const result = await addressService.createAddress(userId, {
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
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
    const { addressLine1, addressLine2, city, state, postalCode } = req.body;

    const result = await addressService.updateAddress(
      userId,
      parseInt(id, 10),
      {
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
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
