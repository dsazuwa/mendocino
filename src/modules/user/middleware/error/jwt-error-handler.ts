import { NextFunction, Request, Response } from 'express';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

import { ApiError } from '@App/utils';

const jwtErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof TokenExpiredError)
    next(ApiError.unauthorized('JWT Expired:', error.message));
  else if (error instanceof NotBeforeError)
    next(ApiError.unauthorized('JWT Not Yet Valid:', error.message));
  else if (error instanceof JsonWebTokenError)
    next(ApiError.unauthorized('JWT Error:', error.message));
  else next(error);
};

export default jwtErrorHandler;
