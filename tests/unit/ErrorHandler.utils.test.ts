import { logger, ApiError } from '../../src/utils';
import errorHandler from '../../src/utils/ErrorHandler';

jest.mock('../../src/utils/Logger');

describe('Error Handler', () => {
  test('should handle error', () => {
    const error = new Error('Some error');
    errorHandler.handleError(error);

    expect(logger.error).toHaveBeenCalledWith(error.message, error);
  });

  test('should determine if error is trusted error', () => {
    const trustedError = new ApiError(400, 'An error');
    const untrustedError1 = new ApiError(404, 'Another error', undefined, false);
    const untrustedError2 = new Error('One more error');

    expect(errorHandler.isTrustedError(trustedError)).toBe(true);
    expect(errorHandler.isTrustedError(untrustedError1)).toBe(false);
    expect(errorHandler.isTrustedError(untrustedError2)).toBe(false);
  });
});
