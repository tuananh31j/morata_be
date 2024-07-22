import categorySchema from './categorySchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';

export const createCategoryValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return validator(categorySchema.createCate, { ...req.body }, next);
};

export const updateCategoryValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return validator(categorySchema.updateCate, { ...req.body }, next);
};
