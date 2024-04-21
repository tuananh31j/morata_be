import { NotFoundError } from '@/error/cutomError';
import customResponse from '@/helpers/response';
import Category from '@/models/Category';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getAllCategories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find({});
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: categories, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get: getDetailedCategory
export const getDetailedCategory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
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

// @Patch: createNewCategory
export const updateCateGory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: category, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Delete: deleteCategory
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
