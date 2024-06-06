import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { checkoutService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createCheckout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await checkoutService.createCheckout(req, res, next);
});
export const handleSessionEvents = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await checkoutService.handleSessionEvents(req, res, next);
});
