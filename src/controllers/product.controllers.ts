import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { productService } from '../services/index';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '@/helpers/response';
import _ from 'lodash';

// @Post: createNewProduct
export const createNewProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { newProduct } = await productService.createNewProduct(req, res, next);

  return res.status(StatusCodes.CREATED).json(
    customResponse({
      data: null,
      message: ReasonPhrases.CREATED,
      status: StatusCodes.CREATED,
      success: true,
    }),
  );
});

// @Get: Get All Product Homepage
export const getProductsHomePage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getProductsHomePage(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
});

// @Get: Get All Product In Filter Page
export const getAllProductsFilterPage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getAllProductsFilterPage(req, res, next);

  const products = data.docs.map((item) => {
    return _.pick(item, ['_id', 'price', 'rating', 'brandId', 'stock', 'reviewIds']);
  });

  return res.status(StatusCodes.OK).json(
    customResponse({
      data: {
        products: products,
        page: data.page,
        totalDocs: data.totalDocs,
        totalPages: data.totalPages,
      },
      success: true,
      status: StatusCodes.OK,
      message: ReasonPhrases.OK,
    }),
  );
});

// @Get: getDetailedProduct
export const getDetailedProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { product, productItems } = await productService.getDetailedProduct(req, res, next);

  const productData = _.pick(product, [
    '_id',
    'name',
    'description',
    'discount',
    'basePrice',
    'images',
    'thumbnail',
    'categoryId',
    'parentSku',
  ]);
  const productItemsData = productItems.map((item) => {
    return _.pick(item, ['_id', 'price', 'stock', 'sku', 'rating', 'status', 'reviewIds', 'details', 'variants']);
  });

  return res.status(StatusCodes.OK).json(
    customResponse({
      data: { ...productData, items: productItemsData },
      message: ReasonPhrases.OK,
      status: StatusCodes.OK,
      success: true,
    }),
  );
});

// @Get Top Latest Products
export const getTopLatestProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getTopLatestProducts(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
});

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getTopDealsOfTheDay(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
});

// @Get Top Reviews
export const getTopReviewsProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getTopReviewsProducts(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
});

// @Get Top Hot Relative Products and the same category
export const getTopRelatedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getTopRelatedProducts(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
});

// @Get all product by category
export const getAllProductByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const data = await productService.getAllProductByCategory(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
});

// @Patch: updateProduct
export const updateProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await productService.updateProduct(req, res, next);
});
