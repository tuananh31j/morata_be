import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { detailValueService } from '@/services';
import { Request, Response } from 'express';

export const createNewDetailValue = asyncHandler(async (req: Request, res: Response) => {
  return await detailValueService.createNewAttribute(req, res);
});

export const updateDetailValue = asyncHandler(async (req: Request, res: Response) => {
  return await detailValueService.updateDetailValue(req, res);
});

export const getAllDetailValue = asyncHandler(async (req: Request, res: Response) => {
  return await detailValueService.getAllDetailValueByDetailId(req, res);
});
