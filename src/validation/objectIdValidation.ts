import mongoose from 'mongoose';
import { NotFoundError } from '@/error/customError';
import { Request, Response, NextFunction, RequestHandler } from 'express';

export const validateObjectId: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  return mongoose.isValidObjectId(req.params.id) ? next(new NotFoundError(`Not found ${req.params.id}`)) : next();
};
