import brandSchema from './brandSchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';

export const createBrandValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return validator(brandSchema.createBrand, { ...req.body }, next);
};

export const updateBrandValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return validator(brandSchema.updateBrand, { ...req.body }, next);
};
