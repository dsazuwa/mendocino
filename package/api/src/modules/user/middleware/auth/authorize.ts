import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../../../../utils';
import messages from '../../utils/messages';

const authorize =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (req.user && roles.some((role) => req.user?.roles.includes(role)))
      next();
    else next(ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS));
  };

export default authorize;
