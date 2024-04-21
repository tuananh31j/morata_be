import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import ErrorResponse from '@/interfaces/ErrorResponse';
import config from '@/config/config';
import { number } from 'joi';

const errorHandlerMiddleware: ErrorRequestHandler = (err: ErrorResponse, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  const statusCode = err.status;

  res.status(statusCode).json({
    data: null,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    code: err.code || StatusCodes.INTERNAL_SERVER_ERROR,
    success: false,
    status: err.status || StatusCodes.INTERNAL_SERVER_ERROR,
    stack: config.env === 'development' ? err.stack : '',
  });
};

export default errorHandlerMiddleware;
