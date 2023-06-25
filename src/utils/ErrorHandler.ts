import logger from './Logger';
import ApiError from './ApiError';

class ErrorHandler {
  public handleError(err: Error) {
    logger.error(err.message, err);
  }

  public isTrustedError(error: Error) {
    return error instanceof ApiError ? error.isOperational : false;
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
