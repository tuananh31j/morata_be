import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { orderService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await orderService.createOrder(req, res, next);
});

export const updateOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await orderService.updateOrder(req, res, next);
});
