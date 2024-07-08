import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { statsService } from '@/services';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '@/helpers/response';

export const totalStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await statsService.totalStats(req, res, next);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: stats, message: ReasonPhrases.OK, success: true, status: StatusCodes.OK }));
});

export const orderByDayStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const stats = await statsService.orderByDayStats(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: stats, message: ReasonPhrases.OK, success: true, status: StatusCodes.OK }));
});

export const orderByMonthStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const statsTotal = await statsService.orderByMonthStats(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: statsTotal, message: ReasonPhrases.OK, success: true, status: StatusCodes.OK }));
});

export const orderByYearStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const statsTotal = await statsService.orderByYearStats(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: statsTotal, message: ReasonPhrases.OK, success: true, status: StatusCodes.OK }));
});
