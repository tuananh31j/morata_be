import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { authService } from '@/services';
import { NextFunction, Request, Response } from 'express';

// @Register
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await authService.register(req, res, next);
});
