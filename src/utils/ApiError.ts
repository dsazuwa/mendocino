export default class ApiError extends Error {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly isOperational: boolean;
  public readonly errors: string[] | null;

  constructor(statusCode: number, message: string, errors?: string[], isOperational = true) {
    super();

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = statusCode;
    this.message = message;
    this.isOperational = isOperational;
    this.errors = errors || null;
  }

  static notFound(msg: string) {
    return new ApiError(404, msg);
  }

  static internal(msg: string) {
    return new ApiError(500, msg);
  }
}
