import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { orderService } from '@/services';
import { NextFunction, Request, Response } from 'express';

export const createOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.createOrder(req, res, next);
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.getAllOrders(req, res, next);
});

export const getAllOrdersByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.getAllOrdersByUser(req, res, next);
});

export const getDetailedOrder = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await orderService.getDetailedOrder(req, res, next);
});

export const cancelOrder = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    return await orderService.cancelOrder(req, res, next);
});

export const deliverOrder = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    return await orderService.deliverOrder(req, res, next);
});
export const confirmOrder = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    return await orderService.confirmOrder(req, res, next);
});
export const shippingOrder = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    return await orderService.shippingOrder(req, res, next);
});

export const finishOrder = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    return await orderService.finishOrder(req, res, next);
});
