import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { reviewService } from '@/services';

export const createNewReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.createNewReview(req, res, next);
});

export const getAllReviewsOfProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.getAllReviewsOfProduct(req, res, next);
});
export const getAllReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.getAllReviews(req, res, next);
});
export const getAllReviewsIsReported = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.getAllReviewsIsReported(req, res, next);
});
export const getAllReviewByFilters = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.getAllReviewsByFilters(req, res, next);
});
export const getDetailReivewOfProduct = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.getDetailReviewsOfProduct(req, res, next);
});
export const updateReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.updateReview(req, res, next);
});
export const CreateReportReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.createNewReport(req, res, next);
});
export const deleteReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.deleteReview(req, res, next);
});
export const deleteReportReview = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await reviewService.deleteReportReview(req, res, next);
});
