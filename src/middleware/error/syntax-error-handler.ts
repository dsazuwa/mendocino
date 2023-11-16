import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../../utils';

export const syntaxErrorHandlier = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    error instanceof SyntaxError &&
    (error as SyntaxError).message.includes('JSON')
  ) {
    next(ApiError.badRequest('JSON Parsing Error', error.message));
  } else {
    next(error);
  }
};
