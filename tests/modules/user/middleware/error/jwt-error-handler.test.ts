import { Request, Response } from 'express';
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from 'jsonwebtoken';

import { jwtErrorHandler } from '@App/modules/user';

describe('jwtErrorHandler Middleware', () => {
  it('should handle TokenExpiredError', () => {
    const error = new TokenExpiredError('Token expired', new Date());
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    jwtErrorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
  });

  it('should handle NotBeforeError', () => {
    const error = new NotBeforeError('Token not yet valid', new Date());
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    jwtErrorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
  });

  it('should handle JsonWebTokenError', () => {
    const error = new JsonWebTokenError('JWT error');
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    jwtErrorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 401 }),
    );
  });

  it('should pass other errors to the next middleware', () => {
    const error = new Error('Some other error');
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    jwtErrorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
