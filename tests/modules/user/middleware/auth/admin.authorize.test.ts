import { Request, Response } from 'express';

import { ApiError } from 'utils';
import { authorizeAdmin } from 'modules/user/middleware/auth';
import messages from 'modules/user/utils/messages';

describe('authorize middleware', () => {
  const res = {} as unknown as Response;

  it('should call next() if user is admin', () => {
    const req = {
      user: {
        roles: ['root'],
      },
    } as unknown as Request;
    const next = jest.fn();

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should call next() with error if user is customer', () => {
    const req = {
      user: {
        roles: ['customer'],
      },
    } as unknown as Request;
    const next = jest.fn();

    authorizeAdmin(req, res, next);

    expect(next).toHaveBeenLastCalledWith(
      ApiError.unauthorized(messages.ERR_UNAUTHORIZED_ACCESS),
    );
  });
});
