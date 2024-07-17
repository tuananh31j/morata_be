import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attributeService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @Get: getAttributeByCategory
export const getAttributeByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.getAttributesByCategory(req, res, next);
});

// @Get: getAttributeByCategory
export const getCreateAttribute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.createAttibute(req, res, next);
});

// @Get: getAllAttributes
export const getAllAttributes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.getAllAttributes(req, res, next);
});
