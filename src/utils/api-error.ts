export default class ApiError extends Error {
  public readonly statusCode: number;

  public readonly message: string;

  public readonly isOperational: boolean;

  public readonly errors: string | string[] | undefined;

  constructor(
    statusCode: number,
    message: string,
    errors?: string | string[],
    isOperational = true,
  ) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    this.errors = errors;
  }

  static badRequest(msg: string, errors?: string | string[]) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg: string, errors?: string | string[]) {
    return new ApiError(401, msg, errors);
  }

  static forbidden(msg: string, errors?: string | string[]) {
    return new ApiError(403, msg, errors);
  }

  static notFound(msg: string, errors?: string | string[]) {
    return new ApiError(404, msg, errors);
  }

  static internal(msg: string, errors?: string | string[]) {
    return new ApiError(500, msg, errors);
  }
}
