import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { orderService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createNewOrder = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return orderService.createNewOrder;
});
