import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attributeValueService } from '@/services';
import { Request, Response } from 'express';

export const createNewAttributeValue = asyncHandler(async (req: Request, res: Response) => {
  return await attributeValueService.createNewAttributeValue(req, res);
});

export const updateAttributeValue = asyncHandler(async (req: Request, res: Response) => {
  return await attributeValueService.updateAttributeValue(req, res);
});

export const getAllAttributeValuesByAttribute = asyncHandler(async (req: Request, res: Response) => {
  return await attributeValueService.getAllAttributeValuesByAttribute(req, res);
});
