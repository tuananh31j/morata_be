import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { statsService } from '@/services';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '@/helpers/response';

export const statsCommon = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const statsTotal = await statsService.statsCommon(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: statsTotal, message: ReasonPhrases.OK, success: true, status: StatusCodes.OK }));
});
