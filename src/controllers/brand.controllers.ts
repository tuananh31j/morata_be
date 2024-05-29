import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { brandService } from '../services/index';

// @Get: getAllBrands
export const getAllBrands = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await brandService.getAllBrands(req, res, next);
});

// @Get: getDetailedBrand
export const getDetailedBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await brandService.getDetailedBrand(req, res, next);
});

// @Post: createNewBrand
export const createNewBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await brandService.createNewBrand(req, res, next);
});

// @Patch: createNewBrand
export const updateBrand = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await brandService.updateCateGory(req, res, next);
});
