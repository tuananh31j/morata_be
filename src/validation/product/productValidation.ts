import productSchema from './productSchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';

export const addProductValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return validator(productSchema.addNewProduct, { ...req.body }, next);
};
