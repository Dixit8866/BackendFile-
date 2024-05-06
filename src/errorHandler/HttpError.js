class BaseError extends Error {
  constructor(name, statusCode, message, isOperational) {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default BaseError;
