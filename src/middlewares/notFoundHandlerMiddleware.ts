import { NotFoundError } from '@/error/customError';
import { NextFunction, Request, Response } from 'express';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const err = new NotFoundError('This route does not exist.');
  next(err);
};

export default notFoundHandler;
