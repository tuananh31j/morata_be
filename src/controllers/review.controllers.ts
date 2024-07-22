import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { reviewService } from '@/services';

export const createNewReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.createNewReview(req, res, next);
});

export const getAllReviewsOfProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.getAllReviewsOfProduct(req, res, next);
});
