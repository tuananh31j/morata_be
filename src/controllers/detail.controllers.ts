import customResponse from '@/helpers/response';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { detailService } from '@/services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getAllDetailsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const data = await detailService.getAllDetailsByCategory(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: 'OK' }));
});

export const getDetailById = asyncHandler(async (req: Request, res: Response) => {
  const data = await detailService.getDetailById(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: data, success: true, status: StatusCodes.OK, message: 'OK' }));
});

export const createNewDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await detailService.createNewDetail(req, res);
  return res
    .status(StatusCodes.CREATED)
    .json(customResponse({ data: null, success: true, status: StatusCodes.CREATED, message: 'Created' }));
});

export const updateDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await detailService.updateDetail(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'OK' }));
});

export const addValueToDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await detailService.addValueToDetail(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'OK' }));
});

export const removeValueFromDetail = asyncHandler(async (req: Request, res: Response) => {
  const data = await detailService.removeValueFromDetail(req, res);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'OK' }));
});
