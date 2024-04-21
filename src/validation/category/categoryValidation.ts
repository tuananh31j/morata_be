import categorySchema from './categorySchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';

export const categoryValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  return validator(categorySchema, { ...req.body }, next);
};
