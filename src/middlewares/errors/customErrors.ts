import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export class HttpExceptions extends Error {
  public status: number;
  public message: string;

  constructor(message: string, status: number) {
    super(message);
    this.message = message || ReasonPhrases.INTERNAL_SERVER_ERROR;
    this.status = status || StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

export class NotFoundError extends HttpExceptions {
  constructor(message: string, status: number) {
    super(message, status);
    this.message = ReasonPhrases.NOT_FOUND;
    this.status = StatusCodes.NOT_FOUND;
  }
}

export class BadRequestError extends HttpExceptions {
  constructor(message: string, status: number) {
    super(message, status);
    this.message = ReasonPhrases.BAD_REQUEST;
    this.status = StatusCodes.BAD_REQUEST;
  }
}
export class UnAuthenticatesError extends HttpExceptions {
  constructor(message: string, status: number) {
    super(message, status);
    this.message = ReasonPhrases.UNAUTHORIZED;
    this.status = StatusCodes.UNAUTHORIZED;
  }
}
export class UnAuthorizedError extends HttpExceptions {
  constructor(message: string, status: number) {
    super(message, status);
    this.message = ReasonPhrases.FORBIDDEN;
    this.status = StatusCodes.FORBIDDEN;
  }
}
