import categorySchema from './categorySchema';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';
import Category from '@/models/Category';
import { BadRequestError } from '@/error/customError';

export const createCategoryValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, attributeIds } = req.body;
    const checkUniqueName = await Category.findOne({ name });
    if (checkUniqueName) next(new BadRequestError('Tên danh mục đã tồn tại!'));
    return validator(categorySchema.createCate, { name, attributeIds }, next);
};

export const updateCategoryValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, attributeIds } = req.body;
    const checkUniqueName = await Category.findOne({ name }).select('_id').lean();

    const isThisCategory = !checkUniqueName || req.params.id == String(checkUniqueName?._id);
    console.log(checkUniqueName);

    if (!isThisCategory) {
        next(new BadRequestError('Tên danh mục đã tồn tại!'));
    }
    return validator(categorySchema.updateCate, { name, attributeIds }, next);
};
