import { Request, Response } from 'express';
import { errorMiddleware, notFoundHandler } from '../../src/middleware';
import { ApiError } from '../../src/utils';
import logger from '../../src/utils/Logger';

jest.mock('../../src/utils/Logger');

describe('Error Middleware', () => {
  test('should handle not found error', () => {
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

  test("shouldn't log trusted errors with statusCode !== 500", () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const msg = 'Not found';
    const error = new ApiError(400, msg);

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: msg,
      error: [],
    });

    expect(logger.error).not.toHaveBeenCalledWith(error.message, error);
  });

  test('should log trusted errors with statusCode == 500', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    const error = new ApiError(500, 'Some known internal server error');

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Some known internal server error',
      error: [],
    });

    expect(logger.error).toHaveBeenCalledWith(error.message, error);
  });

  test('should log and treated untrusted errors as Internal Server Errors', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();
    const error = new Error('Some error');

    errorMiddleware(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
      error: error,
    });

    expect(logger.error).toHaveBeenCalledWith(error.message, error);
  });
});
