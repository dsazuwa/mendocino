import assert from 'assert';
import { NextFunction, Request, Response } from 'express';

import authService from '@user/services/auth.service';
import usersService from '@user/services/users.service';
import messages from '@user/utils/messages';
import { setAccessTokenCookie } from './auth.controller';

export const greet = async (req: Request, res: Response) => {
  res.status(200).json({ message: `Hi!` });
};

export const getUserData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await usersService.getUserData(req);

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

    const profile = await usersService.getProfile(userId);

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

    await authService.createAuthOTP(userId, 'email');

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

    const { isValid } = await authService.getAuthOTP(userId, otp, 'email');

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await usersService.verifyEmail(userId);

    res.status(200).json({ message: messages.VERIFY_EMAIL_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const registerPhone = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;
    const { phoneNumber } = req.body;

    await usersService.createPhone(userId, phoneNumber);

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

    await usersService.verifyPhone(userId);

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

    const result = await usersService.deletePhone(userId);

    if (result === 0)
      return res.status(400).json({ message: messages.DELETE_PHONE_FAIL });

    res.status(200).json({ message: messages.DELETE_PHONE_SUCCESS });
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

    await usersService.updateUser(userId, firstName, lastName);

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

    const result = await usersService.createPassword(userId, password);

    if (result[0] === 0)
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

    const result = await usersService.changePassword(
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

    const { account, user, identity, otherIdentity } =
      await usersService.revokeSocialAuthentication(userId, provider);

    if (account) {
      setAccessTokenCookie(res, authService.generateJWT(userId, 'email'));

      return res.status(200).json({
        message: REVOKE_SOCIAL_SUCCESS(provider),
        effect: 'Switched to email login',
      });
    }

    if (user) {
      res.clearCookie('access-token');

      return res.status(200).json({
        message: REVOKE_SOCIAL_SUCCESS(provider),
        effect: 'Deleted user',
      });
    }

    assert(identity);

    setAccessTokenCookie(res, authService.generateJWT(userId, otherIdentity));

    res.status(200).json({
      message: REVOKE_SOCIAL_SUCCESS(provider),
      effect: `Switched to ${otherIdentity} login`,
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

    await usersService.closeAccount(userId);

    res.status(200).json({ message: messages.CLOSE_CLIENT_ACCOUNT });
  } catch (e) {
    next(e);
  }
};
