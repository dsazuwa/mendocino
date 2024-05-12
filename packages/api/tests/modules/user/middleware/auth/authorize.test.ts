import { Request, Response } from 'express';

import { authorize } from '@app/modules/user';
import messages from '@app/modules/user/utils/messages';
import { ApiError } from '@app/utils';

describe('authorize middleware', () => {
  const res = {} as unknown as Response;

  it('should call next() if user is authorized', () => {
    const req = {
      user: {
        roles: ['super user'],
      },
    } as unknown as Request;
    const next = jest.fn();

    const middleware = authorize(['super user']);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call next() if user is authorized', () => {
    const req = {
      user: {
        roles: ['delivery driver', 'super user'],
      },
    } as unknown as Request;
    const next = jest.fn();

    const middleware = authorize(['super user', 'root']);
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

    const middleware = authorize(['super user', 'manager']);
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

    const middleware = authorize(['super user']);
    middleware(req, res, next);

    expect(next).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS),
    );
  });
});
