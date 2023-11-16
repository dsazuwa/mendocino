import ApiError from 'utils/api-error';

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
    expect(apiError.isOperational).toBe(true);
  });

  test('should create a "Bad Request" error with 400 status code', () => {
    const message = 'Bad Request';

    const apiError = ApiError.badRequest(message);

    expect(apiError.statusCode).toBe(400);
    expect(apiError.message).toBe(message);
    expect(apiError.isOperational).toBe(true);
  });

  test('should create an "Unauthorized" error with 401 status code', () => {
    const message = 'Unauthorized!';

    const apiError = ApiError.unauthorized(message);

    expect(apiError.statusCode).toBe(401);
    expect(apiError.message).toBe(message);
    expect(apiError.isOperational).toBe(true);
  });

  test('should create a "Forbidden" error with 403 status code', () => {
    const message = 'Forbidden!';

    const apiError = ApiError.forbidden(message);

    expect(apiError.statusCode).toBe(403);
    expect(apiError.message).toBe(message);
    expect(apiError.isOperational).toBe(true);
  });

  test('should create a "Not Found" error with 404 status code', () => {
    const message = 'Resource not found';

    const apiError = ApiError.notFound(message);

    expect(apiError.statusCode).toBe(404);
    expect(apiError.message).toBe(message);
    expect(apiError.isOperational).toBe(true);
  });

  test('should create an "Internal Server Error" error with 500 status code', () => {
    const message = 'Internal Server Error';

    const apiError = ApiError.internal(message);

    expect(apiError.statusCode).toBe(500);
    expect(apiError.message).toBe(message);
    expect(apiError.isOperational).toBe(true);
  });
});
