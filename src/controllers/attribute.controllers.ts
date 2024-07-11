import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attributeService } from '@/services';
import { Request, Response } from 'express';

export const createNewAttribute = asyncHandler(async (req: Request, res: Response) => {
  return await attributeService.createNewAttribute(req, res);
});

export const updateAttribute = asyncHandler(async (req: Request, res: Response) => {
  return await attributeService.updateAttribute(req, res);
});

export const getAllAttributesByDetail = asyncHandler(async (req: Request, res: Response) => {
  return await attributeService.getAllAttributesByDetail(req, res);
});
