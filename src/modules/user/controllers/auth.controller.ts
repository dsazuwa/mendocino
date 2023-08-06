import { NextFunction, Request, Response } from 'express';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import userService from '@user/services/user.service';

export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
  providerType: ProviderType,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) res.status(401);
    else {
      const token = authService.generateJWT(userId, providerType);

      const userData = await userService.getUserData(userId);

      res.redirect(
        `${
          process.env.FRONTEND_BASE_URL
        }/OAuthRedirecting?token=${token}&user=${encodeURIComponent(
          JSON.stringify(userData),
        )}`,
      );
    }
  } catch (e) {
    next(e);
  }
};

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await socialLogin(req, res, next, 'google');
  } catch (e) {
    next(e);
  }
};

export const facebookLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await socialLogin(req, res, next, 'facebook');
  } catch (e) {
    next(e);
  }
};
