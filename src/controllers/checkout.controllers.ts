import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { checkoutService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createCheckoutStripe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await checkoutService.createCheckoutStripe(req, res, next);
});

export const handleSessionEventsStripe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await checkoutService.handleSessionEventsStripe(req, res, next);
});

export const createPaymentUrlWithVNpay = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await checkoutService.createPaymentUrlWithVNpay(req, res, next);
});
export const vnpayReturn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await checkoutService.vnpayReturn(req, res, next);
});
export const vnpayIPN = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await checkoutService.vnpayIpn(req, res, next);
});
