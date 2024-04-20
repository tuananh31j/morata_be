import { Request, Response, NextFunction } from 'express';
import categoryServices from '../services';
import asyncHandler from '@/helpers/asyncHandler';

export const getAllCategories = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryServices.getAllCategories(req, res, next);
});

export const getDetailedCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryServices.getDetailedCategory(req, res, next);
});

export const createNewCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryServices.createNewCategory(req, res, next);
});

export const updateCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryServices.updateCategory(req, res, next);
});

export const deleteCategory = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return categoryServices.deleteCategory(req, res, next);
});
