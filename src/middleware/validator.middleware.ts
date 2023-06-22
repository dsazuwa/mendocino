import { NextFunction, Request, Response } from 'express';
import { FieldValidationError, Result, body, validationResult } from 'express-validator';

const passwordRules = body('password')
  .exists()
  .isLength({ min: 8, max: 50 })
  .withMessage('must be between 8 - 20 characters')
  .matches(/\d/)
  .withMessage('must contain at least 1 digit')
  .matches(/[a-z]/)
  .withMessage('must contain at least 1 lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('must contain at least 1 uppercase letter')
  .not()
  .matches(/^\s+|\s+$/)
  .withMessage('no leading or trailing spaces');

export const registerRules = [
  body('firstName').notEmpty().trim(),
  body('lastName').notEmpty().trim(),
  body('email').notEmpty().trim().isEmail().normalizeEmail(),
  passwordRules,
];

export const loginRules = [
  body('email', 'valid email not provided').notEmpty().isEmail().normalizeEmail().trim(),
  body('password', 'password not provided').notEmpty(),
];

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const result: Result = validationResult(req);
  const errors = result.formatWith((error) => {
    switch (error.type) {
      case 'field':
        const err = error as FieldValidationError;
        return `${err.location}[${err.path}]: ${err.msg}`;

      default:
        return error.msg;
    }
  });

  // if (!errors.isEmpty()) return next(errors.array());
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array() });
  next();
};
