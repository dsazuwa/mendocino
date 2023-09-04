import { NextFunction, Request, Response } from 'express';

import { ProviderType } from '@user/models';
import authService from '@user/services/auth.service';
import otpService from '@user/services/otp.service';
import userService from '@user/services/user.service';
import messages from '@user/utils/messages';

export const setJwtCookie = (res: Response, jwt: string) => {
  const inFiveMins = new Date(Date.now() + 5 * 60 * 1000);

  res.cookie('access-token', jwt, {
    secure: true,
    httpOnly: true,
    expires: inFiveMins,
  });
};

export const setAccessTokenCookie = (
  res: Response,
  jwt: string,
  refreshToken: string,
) => {
  const inSevenDays = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  setJwtCookie(res, jwt);

  res.cookie('refresh-token', refreshToken, {
    secure: true,
    httpOnly: true,
    expires: inSevenDays,
  });

  res.cookie('auth-flag', true, {
    secure: true,
    httpOnly: false,
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

    const { jwt, refreshToken } = await authService.generateTokens(
      false,
      customerId,
      email,
      'email',
    );
    setAccessTokenCookie(res, jwt, refreshToken);

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

    if (!user) return res.status(401).json({ message: messages.LOGIN_FAIL });

    const { userId, isAdmin, status } = user;

    if (status === 'suspended')
      return res.status(401).json({
        message: messages.ERR_SUSPENDED_ACCOUNT,
      });

    if (status === 'disabled')
      return res.status(401).json({
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    if (isAdmin) {
      const userData = await userService.getUserData(userId, 'admin');

      await otpService.createOTP(userId, {
        userType: 'admin',
        otpType: 'login',
      });

      return res.status(200).json({
        message: messages.LOGIN_ADMIN_2FA,
        user: userData,
      });
    }

    const userData = await userService.getUserData(userId, 'customer');

    if (status === 'deactivated')
      return res.status(401).json({
        accessToken: authService.generateJwt(email, 'email'),
        user: userData,
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    const { jwt, refreshToken } = await authService.generateTokens(
      false,
      userId,
      email,
      'email',
    );
    setAccessTokenCookie(res, jwt, refreshToken);

    return res.status(200).json({
      message: messages.LOGIN_SUCCESS,
      user: userData,
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
      userType: 'admin',
      otpType: 'login',
    });

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const user = await userService.getUserData(userId, 'customer');

    const { jwt, refreshToken } = await authService.generateTokens(
      true,
      userId,
      user?.email as string,
      'email',
    );
    setAccessTokenCookie(res, jwt, refreshToken);

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

    if (status === 'deactivated' || status === 'disabled')
      return res.status(401).json({
        message: messages.ERR_DEACTIVATED_ACCOUNT,
      });

    if (status === 'suspended')
      return res.status(401).json({
        message: messages.ERR_SUSPENDED_ACCOUNT,
      });

    if (!hasPassword)
      return res
        .status(403)
        .json({ message: messages.REQUEST_RECOVERY_FAIL_THIRD_PARTY_AUTH });

    await otpService.createOTP(userId, {
      userType: isAdmin ? 'admin' : 'customer',
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

    const user = await userService.getUserIdForUser(email);

    if (!user)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { userId, isAdmin } = user;

    const { isValid } = await otpService.getOTP(userId, otp, {
      userType: isAdmin ? 'admin' : 'customer',
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

    const user = await userService.getUserIdForUser(email);

    if (!user)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const { userId, isAdmin } = user;

    const { isValid } = await otpService.getOTP(userId, otp, {
      userType: isAdmin ? 'admin' : 'customer',
      otpType: 'password',
    });

    if (!isValid)
      return res.status(401).json({ message: messages.INVALID_AUTH_OTP });

    const userType = isAdmin ? 'admin' : 'customer';

    const result = await authService.recoverPassword(
      userType,
      userId,
      password,
    );

    if (!result)
      return res.status(400).json({ message: messages.RECOVER_PASSWORD_FAIL });

    const userData = await userService.getUserData(userId, userType);

    const { jwt, refreshToken } = await authService.generateTokens(
      isAdmin,
      userId,
      email,
      'email',
    );

    setAccessTokenCookie(res, jwt, refreshToken);

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

    const { jwt, refreshToken } = await authService.generateTokens(
      false,
      userId,
      email,
      'email',
    );
    setAccessTokenCookie(res, jwt, refreshToken);

    res.status(200).json({
      message: messages.REACTIVATE_SUCCESS,
      user: userData,
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

    if (!userId || !email) return res.status(401);

    const { jwt, refreshToken } = await authService.generateTokens(
      false,
      userId,
      email,
      provider,
    );

    const userData = await userService.getUserData(userId, 'customer');

    res.redirect(
      `${
        process.env.FRONTEND_BASE_URL
      }/OAuthRedirecting?jwt=${jwt}&refreshToken=${refreshToken}&user=${encodeURIComponent(
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

export const setCookieAfterCallBack = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { jwt, refreshToken } = req.body;

    const result = await authService.verifyTokens(jwt, refreshToken);

    if (!result)
      return res
        .status(401)
        .json({ message: messages.SET_COOKIE_INVALID_TOKEN });

    setAccessTokenCookie(res, jwt, refreshToken);

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

    const result = await authService.verifyRefreshToken(refreshToken);

    if (!result)
      return res
        .status(401)
        .clearCookie('access-token')
        .clearCookie('refresh-token')
        .clearCookie('auth-flag')
        .json({ message: messages.INVALID_REFRESH_TOKEN });

    const { email, provider } = result;

    setJwtCookie(res, authService.generateJwt(email, provider));

    res.status(200).json({ message: messages.REFRESH_JWT_SUCCESS });
  } catch (e) {
    next(e);
  }
};
