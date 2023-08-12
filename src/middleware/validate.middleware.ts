import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodEffects, ZodError } from 'zod';

import ApiError from '@utils/api-error';

const getErrors = (error: ZodError) => {
  const errors: string[] = [];

  error.issues.forEach((issue) => {
    errors.push(`${issue.path[0]}.${issue.path[1]}: ${issue.message}`);
  });

  return errors;
};

const validate =
  (schema: AnyZodObject | ZodEffects<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = getErrors(error);
        next(ApiError.badRequest('Validation Error', errors));
      } else next(error);
    }
  };

export default validate;
