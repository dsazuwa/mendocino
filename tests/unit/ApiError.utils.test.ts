import { ApiError } from '../../src/utils';

describe('ApiError', () => {
  test('should create an instance with correct properties', () => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    const errors = ['Error 1', 'Error 2'];
    const isOperational = false;
    let apiError = new ApiError(statusCode, message, errors, isOperational);

    expect(apiError.statusCode).toBe(statusCode);
    expect(apiError.message).toBe(message);
    expect(apiError.errors).toBe(errors);
    expect(apiError.isOperational).toBe(isOperational);

    statusCode = 404;
    message = 'Not Found';
    apiError = new ApiError(statusCode, message);

    expect(apiError.statusCode).toBe(statusCode);
    expect(apiError.message).toBe(message);
    expect(apiError.errors).toBe(null);
    expect(apiError.isOperational).toBe(true);
  });

  test('should create a "Not Found" error with 404 status code', () => {
    const msg = 'Resource not found';

    const apiError = ApiError.notFound(msg);

    expect(apiError.statusCode).toBe(404);
    expect(apiError.message).toBe(msg);
    expect(apiError.errors).toBeNull();
    expect(apiError.isOperational).toBe(true);
  });

  test('should create an "Internal Server Error" error with 500 status code', () => {
    const msg = 'Internal Server Error';

    const apiError = ApiError.internal(msg);

    expect(apiError.statusCode).toBe(500);
    expect(apiError.message).toBe(msg);
    expect(apiError.errors).toBeNull();
    expect(apiError.isOperational).toBe(true);
  });
});
