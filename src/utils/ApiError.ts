import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  status: number;
  errorCode: string;

  constructor(code: number, message: string, errorCode: string = "") {
    super(message);
    this.status = code;
    this.errorCode = errorCode;
  }
}

export const apiErrorHandler = (err: Error | ApiError, req: Request, res: any, next: NextFunction) => {
  const status = (err as ApiError).status || 500;
  const errorCode = (err as ApiError).errorCode || 'undefined_error_code';
  const message = err.message || 'INTERNAL SERVER ERROR';

  res.statusCode = status;
  res.errorCode = errorCode;
  res.message = message;

  res.json({
    status,
    errorCode,
    message,
  });
};
