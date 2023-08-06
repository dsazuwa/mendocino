import { NextFunction, Request, Response } from 'express';

import authService from '@user/services/auth.service';
import userService from '@user/services/user.service';

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) res.status(401);
    else {
      const token = authService.generateJWT(userId, 'google');

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
