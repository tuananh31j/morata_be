import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { orderService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createNewOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await orderService.createNewOrder(req, res, next);
});
