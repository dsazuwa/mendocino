import { Request, Response } from 'express';

import { errorHandler } from '@App/middleware';
import { ApiError, logger } from '@App/utils';

logger.error = jest.fn();

const req = {} as Request;

const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
} as unknown as Response;

const next = jest.fn();

describe('Error Handler', () => {
  it('should not log trusted errors with statusCode !== 500', () => {
    const msg = 'Not found';
    const error = new ApiError(400, msg);

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: msg,
      error: error.errors,
    });

    expect(logger.error).not.toHaveBeenCalledWith(error.message, error);
  });

  it('should log trusted errors with statusCode == 500', () => {
    const error = new ApiError(500, 'Trusted Internal Server Error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Trusted Internal Server Error',
      error: error.errors,
    });

    expect(logger.error).toHaveBeenCalledWith(error.message, error);
  });

  it('should log and treat untrusted errors as Internal Server Errors', () => {
    const error = new Error('Some error');

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error,
    });

    expect(logger.error).toHaveBeenCalledWith(
      `Internal Server Error: ${error.message}`,
      error,
    );
  });
});
