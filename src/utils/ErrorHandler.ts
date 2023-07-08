import logger from './Logger';
import ApiError from './ApiError';

class ErrorHandler {
  public handleError(err: unknown, message?: string) {
    let msg;

    if (err instanceof Error) msg = message ? message : err.message;
    else msg = message ? message : 'Unknown Error:';

    logger.error(msg, err);
  }

  public isTrustedError(error: Error) {
    return error instanceof ApiError ? error.isOperational : false;
  }
}

const errorHandler = new ErrorHandler();

export default errorHandler;
