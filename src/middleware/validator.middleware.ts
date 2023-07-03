import { NextFunction, Request, Response } from 'express';
import { FieldValidationError, Result, body, query, validationResult } from 'express-validator';

export const passwordRules = body('password')
  .trim()
  .exists()
  .isLength({ min: 8, max: 64 })
  .withMessage('must be between 8 - 64 characters')
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
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('email').trim().notEmpty().isEmail().normalizeEmail(),
  passwordRules,
];

export const loginRules = [
  body('email', 'valid email not provided').trim().notEmpty().isEmail().normalizeEmail().trim(),
  body('password', 'password not provided').trim().notEmpty(),
];

export const allowedGroupByFields = ['category', 'status'];

export const menuGroupingRules = [
  query('by')
    .notEmpty()
    .withMessage('Missing groupBy paramater')
    .custom((value) => {
      if (!allowedGroupByFields.includes(value)) throw new Error('Invalid groupBy paramater');
      return true;
    }),
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
