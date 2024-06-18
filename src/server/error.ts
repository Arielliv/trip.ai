import { HttpStatusCode } from 'axios';
import { NextResponse } from 'next/server';

export enum ErrorType {
  AuthenticationError = 0,
  NotFoundError = 1,
  IllegalArgumentError = 2,
  NullPointerError = 3,
  AouthorizationError = 4,
  RuntimeError = 5,
}

export class ServerError extends Error {
  public type: ErrorType;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.name = this.constructor.name;
    this.type = type;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const createNextErrorResponse = (error: any) => {
  let statusCode = HttpStatusCode.InternalServerError;

  if (error instanceof ServerError) {
    switch (error.type) {
      case ErrorType.AuthenticationError:
        statusCode = HttpStatusCode.Unauthorized;
        break;
      case ErrorType.NotFoundError:
        statusCode = HttpStatusCode.NotFound;
        break;
      case ErrorType.IllegalArgumentError:
        statusCode = HttpStatusCode.BadRequest;
        break;
      case ErrorType.NullPointerError:
        statusCode = HttpStatusCode.InternalServerError;
        break;
      case ErrorType.AouthorizationError:
        statusCode = HttpStatusCode.Unauthorized;
        break;
      case ErrorType.RuntimeError:
        statusCode = HttpStatusCode.InternalServerError;
        break;
      default:
        statusCode = HttpStatusCode.InternalServerError;
    }
  }

  return NextResponse.json({ message: error.message }, { status: statusCode });
};
