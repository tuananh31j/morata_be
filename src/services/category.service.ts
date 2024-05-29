import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Category from '@/models/Category';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getAllCategories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find({}).lean();
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: categories, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get: getDetailedCategory
export const getDetailedCategory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findOne({ _id: req.params.id, deleted: false }).lean();
  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: category, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Post: createNewCategory
export const createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.create({ ...req.body });

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: category, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};

// @Patch: updateCategory
export const updateCateGory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: category, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
