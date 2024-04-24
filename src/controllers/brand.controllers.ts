import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { brandService } from '../services/index';

// @Get: getAllBrands
export const getAllBrands = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return brandService.getAllBrands(req, res, next);
});

// @Get: getDetailedBrand
export const getDetailedBrand = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return brandService.getDetailedBrand(req, res, next);
});

// @Post: createNewBrand
export const createNewBrand = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return brandService.createNewBrand(req, res, next);
});

// @Patch: createNewBrand
export const updateBrand = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return brandService.updateCateGory(req, res, next);
});

// @Delete: deleteBrand
export const deleteBrand = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return brandService.deleteBrand(req, res, next);
});
