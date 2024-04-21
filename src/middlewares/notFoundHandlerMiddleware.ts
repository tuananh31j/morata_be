import { NotFoundError } from '@/error/cutomError';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError(ReasonPhrases.NOT_FOUND);
  next(err);
};

export default notFoundHandler;
