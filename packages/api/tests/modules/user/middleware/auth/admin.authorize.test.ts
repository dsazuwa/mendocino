import { Request, Response } from 'express';

import { authorizeAdmin } from '@app/modules/user';
import messages from '@app/modules/user/utils/messages';
import { ApiError } from '@app/utils';

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
