import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attributeService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @Get: getAttributeByCategory
export const getAttributeByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await attributeService.getAttributesByCategory(req, res, next);
});

// @Get: getAllAttributes
export const getAllAttributes = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await attributeService.getAllAttributes(req, res, next);
});
// @Get: getAttributeDetails
export const getAttributeDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await attributeService.getAttributeDetails(req, res, next);
});

// @Post: CreateAttribute
export const CreateAttribute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await attributeService.createAttibute(req, res, next);
});

// @PUT: updateAttibute
export const updateAttibute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await attributeService.updateAttibute(req, res, next);
});
