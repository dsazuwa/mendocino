import { NextFunction, Request, Response } from 'express';
import { Token, User } from '../models';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    res.status(200).json({ user: user.hidePassword() });
  } catch (e) {
    next(e);
  }
};

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { code } = req.params;

    const vCode = await Token.findOne({ where: { userId: user.id, type: 'verify', code } });
    if (!vCode || vCode.expiresAt < new Date())
      return res.status(400).json({ message: 'Invalid code' });

    await user.update({ status: 'active' });
    await vCode.destroy();

    res.status(200).json({ message: 'Successfully Verified!', user: user.hidePassword() });
  } catch (e) {
    next(e);
  }
};

export const resendVerify = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    await Token.destroy({ where: { userId: user.id, type: 'verify' } });

    await user.createToken({
      type: 'verify',
      code: Token.generateCode(),
      expiresAt: Token.getExpiration(),
    });

    res.status(200).json({ message: 'New verification code sent' });
  } catch (e) {
    next(e);
  }
};
