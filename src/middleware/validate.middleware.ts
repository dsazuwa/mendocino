import { NextFunction, Request, Response } from 'express';
import {
  FieldValidationError,
  Result,
  validationResult,
} from 'express-validator';

import { ApiError } from '@App/utils';

const validate = (req: Request, res: Response, next: NextFunction) => {
  const result: Result = validationResult(req);

  const errors = result.formatWith((error) => {
    switch (error.type) {
      case 'field': {
        const err = error as FieldValidationError;
        return `${err.location}[${err.path}]: ${err.msg}`;
      }

      default:
        return error.msg;
    }
  });

  if (!errors.isEmpty())
    return next(new ApiError(400, 'API Validation Error', errors.array()));
  return next();
};

export default validate;
