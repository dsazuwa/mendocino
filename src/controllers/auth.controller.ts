import { NextFunction, Request, Response } from 'express';
import { User } from '../models';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ where: { email } });

    if (user) return res.status(409).json({ message: 'Email already exists' });

    user = await User.create({ firstName, lastName, email, password });

    res
      .cookie('access-token', user.generateJWT(), { expires: new Date(Date.now() + 86400 * 1000) })
      .status(200)
      .json({ message: 'Successfully registered' });
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
      .json({ message: 'Successfully logged in' });
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
