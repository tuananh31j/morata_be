import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { attribute } from '../services/index';

// ================================ Value Attribute ===============================

export const createNewValueAttribute = async (req: Request, res: Response, next: NextFunction) => {
  return await attribute.createNewValueAttribute(req, res, next);
};

export const getAllValueAttributes = async (req: Request, res: Response, next: NextFunction) => {
  return await attribute.getAllValueAttributes(req, res, next);
};

// ============================ Attribute ===========================================

export const createNewAttribute = async (req: Request, res: Response, next: NextFunction) => {
  return await attribute.createNewAttribute(req, res, next);
};

export const getAllAttributes = async (req: Request, res: Response, next: NextFunction) => {
  return await attribute.getAllAttributes(req, res, next);
};
