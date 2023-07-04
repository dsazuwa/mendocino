import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils';

export const trimRequestBody = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = JSON.parse(
      JSON.stringify(req.body, (key, value) => {
        if (typeof value === 'string') {
          return value.toString().trim();
        }
        return value;
      }),
    );

    next();
  } catch (e) {
    next(new ApiError(400, 'Invalid JSON payload'));
  }
};
