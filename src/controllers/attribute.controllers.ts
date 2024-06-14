import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attributeService } from '../services/index';

// ================================ Attribute ===============================

export const createAttribute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.createAttribute(req, res, next);
});

export const getAllAttributesByCategory = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.getAllAttributesByCategory(req, res, next);
});

// ================================ Attribute Value===============================
export const addValueToAttribute = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.addValueToAttribute(req, res, next);
});
