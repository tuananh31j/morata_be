import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { shippingService } from '@/services';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const getProvince = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.getProvince(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getDistrict = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.getDistrict(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getWard = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.getWard(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getService = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.getService(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const calculateShippingFee = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.calculateShippingFee(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const getPickShift = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.getPickShift(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const data = await shippingService.createOrder(req, res);
    return res.status(StatusCodes.OK).json({ ...data });
});
