import { Request, Response } from 'express';

import { syntaxErrorHandlier } from '@middleware/error';
import ApiError from '@App/utils/api-error';

describe('Syntax Error Handler', () => {
  it('should handle json syntax error', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const error = new SyntaxError('Unexpected token u in JSON at position 0');

    syntaxErrorHandlier(error, req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        message: expect.stringContaining('JSON Parsing Error'),
      }),
    );
  });

  it('should call next if not a json syntax error', () => {
    const req = {} as Request;
    const res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as unknown as Response;
    const next = jest.fn();

    const error = new Error('Some other error');

    syntaxErrorHandlier(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
