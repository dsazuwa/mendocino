import { NextFunction, Request, Response } from 'express';
import { Token, User } from '../models';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ where: { email } });

    if (user) return res.status(409).json({ message: 'Email already exists' });

    user = await User.create({ firstName, lastName, email, password });

    await user.createToken({
      type: 'verify',
      code: Token.generateCode(),
      expiresAt: Token.getExpiration(),
    });

    res
      .cookie('access-token', user.generateJWT(), { expires: new Date(Date.now() + 86400 * 1000) })
      .status(200)
      .json({ message: 'Successfully registered', user: user.hidePassword() });
  } catch (e) {
    next(e);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user === null || !user.comparePasswords(password))
      return res.status(401).json({ message: 'Incorrect email or password' });

    res
      .cookie('access-token', user.generateJWT(), { expires: new Date(Date.now() + 86400 * 1000) })
      .status(200)
      .json({ message: 'Successfully logged in', user: user.hidePassword() });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('access-token');
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (e) {
    next(e);
  }
};

export const requestPasswordRecovery = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user) {
      await Token.destroy({ where: { userId: user.id, type: 'password' } });

      await user.createToken({
        type: 'password',
        code: Token.generateCode(),
        expiresAt: Token.getExpiration(),
      });
    }

    res.status(200).json({ message: 'Password reset code sent' });
  } catch (e) {
    next(e);
  }
};

export const verifyRecoveryCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Invalid code' });

    const resetCode = await Token.findOne({ where: { userId: user.id, type: 'password', code } });
    if (!resetCode || resetCode.expiresAt < new Date())
      return res.status(400).json({ message: 'Invalid code' });

    res.status(200).json({ message: 'Account verified' });
  } catch (e) {
    next(e);
  }
};

export const recoverPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code } = req.params;
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Invalid code' });

    const resetCode = await Token.findOne({ where: { userId: user.id, type: 'password', code } });
    if (!resetCode || resetCode.expiresAt < new Date())
      return res.status(400).json({ message: 'Invalid code' });

    await user.update({ password });
    await resetCode.destroy();

    res
      .cookie('access-token', user.generateJWT(), { expires: new Date(Date.now() + 86400 * 1000) })
      .status(200)
      .json({ message: 'Password successfully reset!', user: user.hidePassword() });
  } catch (e) {
    next(e);
  }
};
