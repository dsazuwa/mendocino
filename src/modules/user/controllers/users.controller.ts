import { NextFunction, Request, Response } from 'express';

import authService from '@user/services/auth.service';
import usersService from '@user/services/users.service';
import messages from '@user/utils/messages';

export const greet = async (req: Request, res: Response) => {
  res.json({ message: `Hi!` });
};

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    const user = await usersService.getUserData(userId);

    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
};

export const resendVerifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    await authService.createAuthOTP(userId, 'verify');

    res.status(200).json({ message: messages.REQUEST_VERIFICATION });
  } catch (e) {
    next(e);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { otp } = req.params;

    const { isValid } = await authService.getAuthOTP(userId, otp, 'verify');

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await usersService.verifyEmail(userId);

    res.status(200).json({ message: messages.VERIFY_EMAIL_SUCCESS });
  } catch (e) {
    next(e);
  }
};
