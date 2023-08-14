import { NextFunction, Request, Response } from 'express';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import messages from '@user/utils/messages';

export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
  provider: ProviderType,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) res.status(401);
    else {
      const token = authService.generateJWT(userId, provider);

      const userData = await authService.getUserData(userId, provider);

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

export const setAccessTokenCookie = (res: Response, jwt: string) => {
  res.cookie('access-token', jwt, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 86400 * 1000),
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const acct = await authService.getAccount(email, true);

    if (acct)
      return res
        .status(409)
        .json({ message: messages.REGISTER_ALREADY_EXISTS });

    const { account } = await authService.createUser(
      firstName,
      lastName,
      email,
      password,
    );

    const { userId } = account;

    const userData = await authService.getUserData(userId, 'email');

    setAccessTokenCookie(res, authService.generateJWT(userId, 'email'));

    res.status(200).json({
      message: messages.REGISTER_SUCCESS,
      user: userData,
    });
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

    if (!isUser)
      return res.status(401).json({ message: messages.LOGIN_FAILED });

    const { userId, status } = account;

    const userData = await authService.getUserData(userId, 'email');

    if (status === 'inactive')
      return res.status(403).json({
        accessToken: authService.generateJWT(userId, 'email'),
        user: userData,
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    setAccessTokenCookie(res, authService.generateJWT(userId, 'email'));

    res.status(200).json({
      message: messages.LOGIN_SUCCESS,
      user: userData,
    });
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

export const requestPasswordRecovery = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;

    const account = await authService.getAccount(email, true);

    if (!account)
      return res.status(200).json({ message: messages.REQUEST_RECOVERY });

    if (account.password === null)
      return res
        .status(403)
        .json({ message: messages.REQUEST_RECOVERY_FAILED_THIRD_PARTY_AUTH });

    await authService.createAuthOTP(account.userId, 'recover');

    res.status(200).json({ message: messages.REQUEST_RECOVERY });
  } catch (e) {
    next(e);
  }
};

export const verifyRecoveryOTP = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { otp } = req.params;
    const { email } = req.body;

    const account = await authService.getAccount(email, true);

    if (!account)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { isValid } = await authService.getAuthOTP(
      account.userId,
      otp,
      'recover',
    );

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    res.status(200).json({ message: messages.VERIFY_RECOVERY_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const recoverPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { otp } = req.params;
    const { email, password } = req.body;

    const account = await authService.getAccount(email, true);

    if (!account)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { userId } = account;

    const { isValid } = await authService.getAuthOTP(userId, otp, 'recover');

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await authService.recoverPassword(userId, password);

    const userData = await authService.getUserData(userId, 'email');

    setAccessTokenCookie(res, authService.generateJWT(userId, 'email'));

    res.status(200).json({
      message: messages.RECOVER_PASSWORD_SUCCESS,
      user: userData,
    });
  } catch (e) {
    next(e);
  }
};

export const reactivate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId ?? -1;

    await authService.reactivate(userId);

    const userData = await authService.getUserData(userId, 'email');

    setAccessTokenCookie(res, authService.generateJWT(userId, 'email'));

    res.status(200).json({
      message: messages.REACTIVATE_SUCCESS,
      user: userData,
    });
  } catch (e) {
    next(e);
  }
};
