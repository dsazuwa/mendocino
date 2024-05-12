import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../../../../utils';
import messages from '../../utils/messages';

const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && !req.user.roles.includes('customer')) next();
  else next(ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS));
};

export default authorizeAdmin;
