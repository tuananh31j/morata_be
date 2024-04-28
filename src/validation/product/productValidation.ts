import productSchema from './productSchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';

export const categoryValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  return validator(productSchema, { ...req.body }, next);
};
