import customResponse from '@/helpers/response';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { statsService } from '@/services';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

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

export const orderByDateRangeStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { startDate, endDate } = req.query;



  const stats = await statsService.orderByDateRangeStats(startDate as string, endDate as string);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: stats, message: ReasonPhrases.OK, success: true, status: StatusCodes.OK }));
});
export const getProductStats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const productStats = await statsService.getProductStats(req, res, next);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({
      data: productStats,
      message: ReasonPhrases.OK,
      success: true,
      status: StatusCodes.OK
    }));
});