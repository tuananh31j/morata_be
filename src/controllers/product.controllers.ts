import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { productService } from '../services/index';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '@/helpers/response';
import _ from 'lodash';

// @Get: getAllCategories
export const getAllProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getAllProducts(req, res, next);
});

// @Get: getDetailedProduct
export const getDetailedProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const product = await productService.getDetailedProduct(req, res, next);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: product, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
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
export const getTopRelatedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getTopRelatedProducts(req, res, next);
});

// @Get all product for admin
export const getAllProductAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getAllProductAdmin(req, res, next);
});
// @Get details product for admin
export const getDetailedProductAdmin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.getDetailedProductAdmin(req, res, next);
});

// @Post: createNewProduct
export const createNewProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.createNewProduct(req, res, next);
});
// @Post: createNewVariationToProduct
export const addNewVariationToProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.addNewVariationToProduct(req, res, next);
});

// @Patch: updateProduct
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.updateProduct(req, res, next);
});

// @Patch: updateProductVariation
export const updateProductVariation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.updateProductVariation(req, res, next);
});

// @PATCH: hiddenProduct
export const hiddenProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.hiddenProduct(req, res, next);
});
// @PATCH: showProduct
export const showProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.showProduct(req, res, next);
});
// @GET: filterProductsBycategory
export const filterProductsBycategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await productService.filterProductsBycategory(req, res, next);
});
