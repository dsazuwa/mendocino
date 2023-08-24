import { Request, Response, NextFunction } from 'express';

import { ApiError } from '@App/utils';

import messages from '@user/utils/messages';

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && !req.user.roles.includes('customer')) next();
  else next(ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS));
};

export default authorizeAdmin;
