import asyncHandler from '@/helpers/asyncHandler';
import { dataService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @Get: getAllBrands
export const generateData = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return dataService.generateData(req, res, next);
});
