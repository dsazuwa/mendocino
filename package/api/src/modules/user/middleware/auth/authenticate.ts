import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import messages from '../../utils/messages';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', (err: Error, user: Express.User) => {
    if (err) next(err);
    else if (!user)
      res.status(401).json({ message: messages.ERR_INVALID_ACCESS_TOKEN });
    else if (user.status === 'deactivated' || user.status === 'disabled')
      res.status(401).json({ message: messages.ERR_DEACTIVATED_ACCOUNT });
    else if (user.status === 'suspended')
      res.status(401).json({ message: messages.ERR_SUSPENDED_ACCOUNT });
    else {
      req.user = user;
      next();
    }
  })(req, res, next);
};

export default authenticate;
