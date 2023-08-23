import { NextFunction, Request, Response } from 'express';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import userService from '@user/services/user.service';
import messages from '@user/utils/messages';
import otpService from '../services/otp.service';

export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
  provider: ProviderType,
) => {
  try {
    const userId = req.user?.userId;
    const email = req.user?.email;

    if (!userId || !email) return res.status(401);

    const token = authService.generateJWT(email, provider);

    const userData = await userService.getUserData(userId, 'customer');

    res.redirect(
      `${
        process.env.FRONTEND_BASE_URL
      }/OAuthRedirecting?token=${token}&user=${encodeURIComponent(
        JSON.stringify(userData),
      )}`,
    );
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

    const acct = await userService.getUserIdForUser(email);

    if (acct)
      return res
        .status(409)
        .json({ message: messages.REGISTER_ALREADY_EXISTS });

    const { customerId } = await authService.createCustomer(
      firstName,
      lastName,
      email,
      password,
    );

    const userData = await userService.getUserData(customerId, 'customer');

    setAccessTokenCookie(res, authService.generateJWT(email, 'email'));

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

    const user = await authService.loginUser(email, password);

    if (!user) return res.status(401).json({ message: messages.LOGIN_FAILED });

    const { userId, isAdmin, status } = user;

    const userData = await userService.getUserData(
      userId,
      isAdmin ? 'admin' : 'customer',
    );

    if (status === 'deactivated')
      return res.status(401).json({
        accessToken: authService.generateJWT(email, 'email'),
        user: userData,
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    if (status === 'suspended')
      return res.status(401).json({
        message: messages.ERR_SUSPENDED_ACCOUNT,
      });

    if (status === 'disabled')
      return res.status(401).json({
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    setAccessTokenCookie(res, authService.generateJWT(email, 'email'));

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

    const user = await userService.getUserForRecovery(email);

    if (!user)
      return res.status(200).json({ message: messages.REQUEST_RECOVERY });

    if (user.status === 'deactivated')
      return res.status(401).json({
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    if (user.status === 'suspended')
      return res.status(401).json({
        message: messages.ERR_SUSPENDED_ACCOUNT,
      });

    if (!user.hasPassword)
      return res
        .status(403)
        .json({ message: messages.REQUEST_RECOVERY_FAILED_THIRD_PARTY_AUTH });

    await otpService.createCustomerOTP(user.userId, 'password');

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

    const user = await userService.getUserIdForUser(email);

    if (!user)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { isValid } = await otpService.getCustomerOTP(
      user.userId,
      'password',
      otp,
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

    const user = await userService.getUserIdForUser(email);

    if (!user)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { userId } = user;

    const { isValid } = await otpService.getCustomerOTP(
      userId,
      'password',
      otp,
    );

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    await authService.recoverCustomerPassword(userId, password);

    const userData = await userService.getUserData(userId, 'customer');

    setAccessTokenCookie(res, authService.generateJWT(email, 'email'));

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
    const userId = req.user?.userId;
    const email = req.user?.email;

    if (!email || !userId) return res.status(401);

    await authService.reactivateCustomer(userId);

    const userData = await userService.getUserData(userId, 'customer');

    setAccessTokenCookie(res, authService.generateJWT(email, 'email'));

    res.status(200).json({
      message: messages.REACTIVATE_SUCCESS,
      user: userData,
    });
  } catch (e) {
    next(e);
  }
};
