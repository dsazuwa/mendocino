import { NextFunction, Request, Response } from 'express';
import { ApiError, errorHandler } from '../utils';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  next(ApiError.notFound(`Resource not found - ${req.method} ${req.originalUrl}`));
};

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (errorHandler.isTrustedError(error)) {
    const apiError = error as ApiError;

    if (apiError.statusCode === 500) errorHandler.handleError(error);

    return res.status(apiError.statusCode).json({
      message: apiError.message,
      error: apiError.errors !== null ? apiError.errors : [],
    });
  }

  errorHandler.handleError(error);
  res.status(500).json({ message: 'Internal Server Error', error });
};
