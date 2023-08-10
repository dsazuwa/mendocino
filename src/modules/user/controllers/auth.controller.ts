import { NextFunction, Request, Response } from 'express';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import userService from '@user/services/user.service';
import messages from '@user/utils/messages';

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

const authenticateResponse = (
  res: Response,
  jwt: string,
  message: string,
  user: object | null,
) => {
  res.cookie('access-token', jwt, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 86400 * 1000),
  });

  res.status(200).json({ message, user });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const acct = await authService.getAccount(email);

    if (acct)
      res.status(409).json({ message: messages.REGISTER_ALREADY_EXISTS });
    else {
      const { account } = await authService.createUser(
        firstName,
        lastName,
        email,
        password,
      );

      const userData = await userService.getUserData(account.userId);

      authenticateResponse(
        res,
        authService.generateJWT(account.userId, 'email'),
        messages.REGISTER_SUCCESS,
        userData,
      );
    }
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;

    const { account, isUser } = await authService.loginUser(email, password);

    if (!isUser) res.status(401).json({ message: messages.LOGIN_FAILED });
    else {
      const userData = await userService.getUserData(account.userId);

      if (account.status === 'inactive')
        res.status(403).json({
          accessToken: authService.generateJWT(account.userId, 'email'),
          user: userData,
          message: messages.ERR_DEACTIVATED_ACCOUNT,
        });
      else
        authenticateResponse(
          res,
          authService.generateJWT(account.userId, 'email'),
          messages.LOGIN_SUCCESS,
          userData,
        );
    }
  } catch (e) {
    next(e);
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    res.clearCookie('access-token');
    res.status(200).json({ message: messages.LOGOUT });
  } catch (e) {
    next(e);
  }
};
