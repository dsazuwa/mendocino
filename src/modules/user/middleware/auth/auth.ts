import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import messages from '@user/utils/messages';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', (err: Error, user: Express.User) => {
    if (err) next(err);
    else if (!user)
      res.status(401).json({ message: messages.ERR_INVALID_ACCESS_TOKEN });
    else if (user.status === 'inactive')
      res.status(401).json({ message: messages.ERR_DEACTIVATED_ACCOUNT });
    else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

export default authenticate;
