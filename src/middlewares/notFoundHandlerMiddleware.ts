import { NotFoundError } from '@/error/customError';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError('This route does not exist.');
  next(err);
};

export default notFoundHandler;
