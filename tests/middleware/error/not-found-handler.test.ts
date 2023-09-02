import { Request, Response } from 'express';

import { notFoundHandler } from '@App/middleware';
import ApiError from '@App/utils/api-error';

describe('Not Found Handler', () => {
  it('should handle not found error', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    notFoundHandler(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 404,
        message: expect.stringContaining('Resource not found'),
      }),
    );
  });
});
