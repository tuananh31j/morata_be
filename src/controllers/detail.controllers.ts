import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { detailService } from '@/services';
import { Request, Response } from 'express';

export const createNewDetail = asyncHandler(async (req: Request, res: Response) => {
  return await detailService.createNewDetail(req, res);
});

export const updateDetail = asyncHandler(async (req: Request, res: Response) => {
  return await detailService.updateDetail(req, res);
});

export const getAllDetailsByCategory = asyncHandler(async (req: Request, res: Response) => {
  return await detailService.getAllDetailsByCategory(req, res);
});
