import { Request, Response } from 'express';

import { ApiError } from '@App/utils';

import messages from '@user/utils/messages';
import { authorize } from '@user/middleware/auth';

describe('authorize middleware', () => {
  const res = {} as unknown as Response;

  it('should call next() if user is authorized', () => {
    const req = {
      user: {
        roles: ['admin'],
      },
    } as unknown as Request;
    const next = jest.fn();

    const middleware = authorize(['admin']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call next() if user is authorized', () => {
    const req = {
      user: {
        roles: ['delivery driver', 'admin'],
      },
    } as unknown as Request;
    const next = jest.fn();

    const middleware = authorize(['admin', 'root']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call next() with an error if user is not authorized', () => {
    const req = {
      user: {
        roles: ['user'],
      },
    } as unknown as Request;
    const next = jest.fn();

    const middleware = authorize(['admin', 'manager']);
    middleware(req, res, next);

    expect(next).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS),
    );
  });

  it('should call next() with an error if user is not authorized', () => {
    const req = {
      user: {
        roles: ['user'],
      },
    } as unknown as Request;
    const next = jest.fn();

    const middleware = authorize(['admin']);
    middleware(req, res, next);

    expect(next).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS),
    );
  });
});
