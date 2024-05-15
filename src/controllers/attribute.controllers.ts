import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attributeService } from '../services/index';

// ================================ Value Attribute ===============================

export const createNewValueAttribute = async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.createNewValueAttribute(req, res, next);
};

export const getAllValueAttributes = async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.getAllValueAttributes(req, res, next);
};

// ============================ Attribute ===========================================

export const createNewAttribute = async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.createNewAttribute(req, res, next);
};

export const getAllAttributes = async (req: Request, res: Response, next: NextFunction) => {
  return await attributeService.getAllAttributes(req, res, next);
};
