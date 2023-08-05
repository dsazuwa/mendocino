import { NextFunction, Request, Response } from 'express';

import { ApiError, logger } from '@App/utils';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ApiError && error.isOperational) {
    if (error.statusCode === 500) logger.error(error.message, error);

    res.status(error.statusCode).json({
      message: error.message,
      error: error.errors,
    });
  } else {
    logger.error(`Internal Server Error: ${error.message}`, error);

    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
