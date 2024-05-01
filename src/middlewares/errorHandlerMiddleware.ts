import config from '@/config/env.config';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  const status = err.status;
  const message = err.message;
  const name = err.name;
  res.status(status).json({
    data: null,
    success: false,
    status: status || StatusCodes.INTERNAL_SERVER_ERROR,
    name: name,
    message: message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    stack: config.env === 'development' ? err.stack : '',
  });
};

export default errorHandler;
