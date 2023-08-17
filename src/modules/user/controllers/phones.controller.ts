import { NextFunction, Request, Response } from 'express';

import authService from '@user/services/auth.service';
import phonesService from '@user/services/phones.service';
import messages from '@user/utils/messages';

export const registerPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { phoneNumber } = req.body;

    await phonesService.createPhone(userId, phoneNumber);

    res.status(200).json({ message: messages.REGISTER_PHONE_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const resendVerifySMS = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    await authService.createAuthOTP(userId, 'phone');

    res.status(200).json({ message: messages.REQUEST_VERIFICATION_SMS });
  } catch (e) {
    next(e);
  }
};

export const verifyPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { otp } = req.params;

    const { isValid } = await authService.getAuthOTP(userId, otp, 'phone');

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await phonesService.verifyPhone(userId);

    res.status(200).json({ message: messages.VERIFY_PHONE_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const deletePhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    const result = await phonesService.deletePhone(userId);

    if (result === 0)
      return res.status(400).json({ message: messages.DELETE_PHONE_FAIL });

    res.status(200).json({ message: messages.DELETE_PHONE_SUCCESS });
  } catch (e) {
    next(e);
  }
};
