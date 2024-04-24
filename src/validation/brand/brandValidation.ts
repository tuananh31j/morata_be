import brandSchema from './brandSchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';

export const categoryValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  return validator(brandSchema, { ...req.body }, next);
};
