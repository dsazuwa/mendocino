import { NextFunction, Request, Response } from 'express';

import authService from '@user/services/auth.service';
import customerService from '@user/services/customer.service';
import otpService from '@user/services/otp.service';
import userService from '@user/services/user.service';

import messages from '@user/utils/messages';
import { setAccessTokenCookie } from './auth.controller';

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.getUserDataFromReq(req);

    res.status(200).json({ user });
  } catch (e) {
    next(e);
  }
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    const profile = await customerService.getProfile(userId);

    res.status(200).json({ profile });
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

    await otpService.createCustomerOTP(userId, 'email');

    res.status(200).json({ message: messages.REQUEST_VERIFICATION_EMAIL });
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

    const { isValid } = await otpService.getCustomerOTP(userId, 'email', otp);

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await customerService.verifyEmail(userId);

    res.status(200).json({ message: messages.VERIFY_EMAIL_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const updateUserName = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { firstName, lastName } = req.body;

    await customerService.updateName(userId, firstName, lastName);

    res.status(200).json({ message: messages.UPDATE_USER_NAME });
  } catch (e) {
    next(e);
  }
};

export const createPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { password } = req.body;

    const result = await customerService.createPassword(userId, password);

    if (!result)
      return res.status(409).json({ message: messages.CREATE_PASSWORD_FAILED });

    res.status(200).json({ message: messages.CREATE_PASSWORD_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { currentPassword, newPassword } = req.body;

    const result = await customerService.changePassword(
      userId,
      currentPassword,
      newPassword,
    );

    if (!result)
      return res.status(404).json({ message: messages.PASSWORD_CHANGE_FAILED });

    res.status(200).json({ message: messages.PASSWORD_CHANGE_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const revokeSocialAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { provider } = req.body;

    const { REVOKE_SOCIAL_SUCCESS } = messages;

    const { result, switchTo, email } =
      await customerService.revokeSocialAuthentication(userId, provider);

    if (!result || switchTo === undefined)
      return res.status(400).json({ message: messages.REVOKE_SOCIAL_FAILED });

    if (switchTo === 'email') {
      setAccessTokenCookie(res, authService.generateJWT(email, 'email'));

      return res.status(200).json({
        message: REVOKE_SOCIAL_SUCCESS(provider),
        effect: 'Switched to email login',
      });
    }

    setAccessTokenCookie(res, authService.generateJWT(email, switchTo));

    res.status(200).json({
      message: REVOKE_SOCIAL_SUCCESS(provider),
      effect: `Switched to ${switchTo} login`,
    });
  } catch (e) {
    next(e);
  }
};

export const closeAccount = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    await customerService.closeAccount(userId);

    res.status(200).json({ message: messages.CLOSE_CLIENT_ACCOUNT });
  } catch (e) {
    next(e);
  }
};
