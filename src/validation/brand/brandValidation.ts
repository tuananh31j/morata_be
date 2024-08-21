import brandSchema from './brandSchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';
import Brand from '@/models/Brand';
import { BadRequestError } from '@/error/customError';

export const createBrandValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const checkUniqueName = await Brand.findOne({ name }).select('_id').lean();
    if (checkUniqueName) next(new BadRequestError('Tên thương hiệu đã tồn tại!'));
    return validator(brandSchema.createBrand, { ...req.body }, next);
};

export const updateBrandValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const checkUniqueName = await Brand.findOne({ name }).select('_id').lean();
    const isThisCategory = req.params.id == String(checkUniqueName?._id);

    if (!isThisCategory) {
        next(new BadRequestError('Tên thương hiệu đã tồn tại!'));
    }
    return validator(brandSchema.updateBrand, { name }, next);
};
