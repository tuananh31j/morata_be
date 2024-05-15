import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { productService } from '../services/index';

// @Get: getAllCategories
export const getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.getAllProducts(req, res, next);
});

// @Get: getDetailedProduct
export const getDetailedProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.getDetailedProduct(req, res, next);
});

// @Get Top Latest Products
export const getTopLatestProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.getTopLatestProducts(req, res, next);
});

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.getTopDealsOfTheDay(req, res, next);
});

// @Get Top Reviews
export const getTopReviewsProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.getTopReviewsProducts(req, res, next);
});

// @Get Top Hot Relative Products and the same category
export const getTopRelativeProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.getTopRelativeProducts(req, res, next);
});

// @Post: createNewProduct
export const createNewProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.createNewProduct(req, res, next);
});

// @Patch: updateProduct
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.updateProduct(req, res, next);
});

// @Delete: deleteProduct
export const deleteProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.deleteProduct(req, res, next);
});
