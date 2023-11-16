import { NextFunction, Request, Response } from 'express';

import customerPhoneService from '../services/customer-phone.service';
import otpService from '../services/otp.service';
import messages from '../utils/messages';

export const registerPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;
    const { phoneNumber } = req.body;

    if (!userId) return res.status(401);

    await customerPhoneService.createPhone(userId, phoneNumber);

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
    const userId = req.user?.userId;

    if (!userId) return res.status(401);

    await otpService.createOTP(userId, {
      isAdmin: false,
      otpType: 'phone',
    });

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
    const userId = req.user?.userId;
    const { otp } = req.params;

    if (!userId) return res.status(401);

    const { isValid } = await otpService.getOTP(userId, otp, {
      isAdmin: false,
      otpType: 'phone',
    });

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await customerPhoneService.verifyPhone(userId);

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
    const userId = req.user?.userId;

    if (!userId) return res.status(401);

    const result = await customerPhoneService.deletePhone(userId);

    if (result)
      return res.status(200).json({ message: messages.DELETE_PHONE_SUCCESS });

    return res.status(400).json({ message: messages.DELETE_PHONE_FAIL });
  } catch (e) {
    next(e);
  }
};
