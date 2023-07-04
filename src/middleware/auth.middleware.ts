import { config } from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import passport, { PassportStatic } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '../models';
import { ApiError } from '../utils';

config();

const { JWT_SECRET } = process.env;

export const configureJWTStrategy = (passport: PassportStatic) => {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      (jwt_payload, done) => {
        User.findOne({ where: { uuid: jwt_payload.uuid } })
          .then((user) => {
            return user ? done(null, user) : done(null, false);
          })
          .catch((err) => done(err, false, ApiError.internal('Error on Passport Verification')));
      },
    ),
  );
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', (err: Error, user: User) => {
    if (err) return next(err);

    if (!user) return res.status(401).json({ message: 'Unauthorized: invalid access token' });

    if (user.status === 'inactive')
      return res.status(401).json({ message: 'Unauthorized: deactivated account' });

    req.user = user;
    next();
  })(req, res, next);
};

export const permitOnlyPending = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (user.status !== 'pending')
    return res.status(401).json({ message: 'Unauthorized: Account already verified' });

  next();
};

export const permitOnlyActive = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (user.status !== 'active')
    return res.status(401).json({ message: 'Unauthorized: Unverified' });

  next();
};

export const permitOnlyClient = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (user.role !== 'client') return res.status(403).json({ message: 'Access Denied' });

  next();
};

export const permitOnlyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as User;

  if (user.status !== 'active')
    return res.status(403).json({ message: 'Access Denied: Unverified' });

  if (user.role != 'admin') return res.status(403).json({ message: 'Access Denied' });

  next();
};
