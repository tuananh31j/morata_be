import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { productService } from '../services/index';

// @Get: getAllCategories
export const getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return productService.getAllProducts(req, res, next);
});

// @Get: getDetailedProduct
export const getDetailedProduct = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.getDetailedProduct(req, res, next);
});

// @Get Top Latest Products
export const getTopLatestProducts = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.getTopLatestProducts(req, res, next);
});

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.getTopDealsOfTheDay(req, res, next);
});

// @Get Top Reviews
export const getTopReviewsProducts = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.getTopReviewsProducts(req, res, next);
});

// @Get Top Hot Relative Products and the same category
export const getTopRelativeProducts = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.getTopRelativeProducts(req, res, next);
});

// @Post: createNewProduct
export const createNewProduct = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.createNewProduct(req, res, next);
});

// @Patch: updateProduct
export const updateProduct = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.updateProduct(req, res, next);
});

// @Delete: deleteProduct
export const deleteProduct = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return productService.deleteProduct(req, res, next);
});
