import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { categoryService } from '../services/index';

// @Get: getAllCategories
export const getAllCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return categoryService.getAllCategories(req, res, next);
});

// @Get: getDetailedCategory
export const getDetailedCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryService.getDetailedCategory(req, res, next);
});

// @Post: createNewCategory
export const createNewCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryService.createNewCategory(req, res, next);
});

// @Patch: createNewCategory
export const updateCateGory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryService.updateCateGory(req, res, next);
});

// @Delete: deleteCategory
export const deleteCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryService.deleteCategory(req, res, next);
});
