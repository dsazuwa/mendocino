import { NextFunction, Request, Response } from 'express';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import otpService from '@user/services/otp.service';
import tokenService from '@user/services/token.service';
import userService from '@user/services/user.service';
import messages from '@user/utils/messages';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const inFiveMins = new Date(Date.now() + 5 * 60 * 1000);
  const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  res.cookie('access-token', accessToken, {
    secure: true,
    httpOnly: true,
    expires: inFiveMins,
  });

  res.cookie('auth-flag', true, {
    secure: true,
    httpOnly: false,
    expires: inFiveMins,
  });

  res.cookie('refresh-token', refreshToken, {
    secure: true,
    httpOnly: true,
    expires: inSevenDays,
  });
};

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const acct = await userService.getUserByEmail(email);

    if (acct)
      return res
        .status(409)
        .json({ message: messages.REGISTER_ALREADY_EXISTS });

    const { customerId, user } = await authService.createCustomer(
      firstName,
      lastName,
      email,
      password,
    );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      customerId,
      email,
      'email',
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: messages.REGISTER_SUCCESS,
      user,
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

    const result = await authService.loginUser(email, password);

    if (!result) return res.status(401).json({ message: messages.LOGIN_FAIL });

    const { isAdmin, userId, user } = result;

    if (user.status === 'suspended')
      return res.status(401).json({
        message: messages.ERR_SUSPENDED_ACCOUNT,
      });

    if (user.status === 'disabled')
      return res.status(401).json({
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    if (isAdmin) {
      await otpService.createOTP(userId, { isAdmin: true, otpType: 'login' });

      return res.status(200).json({
        message: messages.LOGIN_ADMIN_2FA,
        user,
      });
    }

    if (user.status === 'deactivated')
      return res.status(401).json({
        accessToken: tokenService.generateShortLivedAccessToken(email, 'email'),
        user,
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      userId,
      email,
      'email',
    );

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: messages.LOGIN_SUCCESS,
      user,
    });
  } catch (e) {
    next(e);
  }
};

export const loginAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, otp } = req.params;

    if (!id || !otp)
      return res
        .status(400)
        .json({ message: messages.LOGIN_ADMIN_2FA_INVALID });

    const userId = parseInt(id, 10);

    const { isValid } = await otpService.getOTP(userId, otp, {
      isAdmin: true,
      otpType: 'login',
    });

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const user = await userService.getUserWithoutId(userId, true);

    if (user.status === 'disabled')
      return res
        .status(401)
        .clearCookie('access-token')
        .json({ message: messages.LOGIN_ADMIN_2FA_DISABLED });

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      true,
      userId,
      user.email,
      'email',
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: messages.LOGIN_ADMIN_2FA_SUCCESS, user });
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
    await tokenService.revokeRefreshToken(req.cookies['refresh-token']);

    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    res.clearCookie('auth-flag');

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

    const { isAdmin, userId, status, hasPassword } = user;

    if (['disabled', 'suspended', 'deactivated'].includes(status))
      res.status(401).json({ message: `User account ${status}` });

    if (!hasPassword)
      return res
        .status(403)
        .json({ message: messages.REQUEST_RECOVERY_FAIL_THIRD_PARTY_AUTH });

    await otpService.createOTP(userId, {
      isAdmin,
      otpType: 'password',
    });

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

    const user = await userService.getUserByEmail(email);

    if (!user)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { userId, isAdmin } = user;

    const { isValid } = await otpService.getOTP(userId, otp, {
      isAdmin,
      otpType: 'password',
    });

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

    const user = await userService.getUserByEmail(email);

    if (!user)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    if (['disabled', 'suspended', 'deactivated'].includes(user.status))
      res.status(401).json({ message: `User account ${user.status}` });

    const { userId, isAdmin, ...userWithNoId } = user;

    const { isValid } = await otpService.getOTP(userId, otp, {
      isAdmin,
      otpType: 'password',
    });

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const result = await authService.recoverPassword(isAdmin, userId, password);

    if (!result)
      return res.status(400).json({ message: messages.RECOVER_PASSWORD_FAIL });

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      isAdmin,
      userId,
      email,
      'email',
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: messages.RECOVER_PASSWORD_SUCCESS,
      user: userWithNoId,
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

    const user = await userService.getUserWithoutId(userId, false);

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      userId,
      email,
      'email',
    );

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      message: messages.REACTIVATE_SUCCESS,
      user,
    });
  } catch (e) {
    next(e);
  }
};

export const socialLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
  provider: ProviderType,
) => {
  try {
    const userId = req.user?.userId;
    const email = req.user?.email;
    const status = req.user?.status;

    if (!userId || !email || !status) return res.status(401);

    if (status === 'deactivated' || status === 'suspended')
      return res.redirect(
        `${process.env.FRONTEND_BASE_URL}/OAuthRedirecting?accessToken=undefined&refreshToken=undefined&user=undefined`,
      );

    const { accessToken, refreshToken } = await tokenService.generateTokens(
      false,
      userId,
      email,
      provider,
    );

    const user = await userService.getUserWithoutId(userId, false);

    res.redirect(
      `${
        process.env.FRONTEND_BASE_URL
      }/OAuthRedirecting?accessToken=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(
        JSON.stringify(user),
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

export const setCookieAfterCallBack = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { accessToken, refreshToken } = req.body;

    const result = await tokenService.verifyTokens(accessToken, refreshToken);

    if (!result.isValid)
      return res
        .status(401)
        .json({ message: messages.SET_COOKIE_INVALID_TOKEN });

    setAuthCookies(
      res,
      tokenService.generateAccessToken(result.email, result.provider),
      refreshToken,
    );

    res.status(200).json({ message: messages.SET_COOKIE_SUCCESS });
  } catch (e) {
    next(e);
  }
};

export const refreshJwt = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies['refresh-token'];

    const result = await tokenService.rotateTokens(refreshToken);

    if (result.error !== undefined)
      return res
        .status(401)
        .clearCookie('access-token')
        .clearCookie('refresh-token')
        .clearCookie('auth-flag')
        .json({ message: result.error });

    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.status(200).json({ message: messages.REFRESH_JWT_SUCCESS });
  } catch (e) {
    next(e);
  }
};
