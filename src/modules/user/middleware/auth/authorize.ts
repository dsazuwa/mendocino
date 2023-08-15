import { Request, Response, NextFunction } from 'express';

import { ApiError } from '@App/utils';

import messages from '@user/utils/messages';

const authorize =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const isAuthorized =
      req.user && roles.some((role) => req.user?.roles.includes(role));

    if (isAuthorized) next();
    else next(ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS));
  };

export default authorize;
