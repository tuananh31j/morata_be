import customResponse from '@/helpers/response';
import Order from '@/models/Order';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getAllBrand
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const newOrders = new Order({
    ...req.body,
  });

  if (req.body.paymentMethod === 'cash') {
    if (req.body.totalPrice >= 1000) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: ReasonPhrases.NOT_ACCEPTABLE });
    }
    await newOrders.save();
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: newOrders, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

export const updateOrder = async (req: Request, res: Response, next: NextFunction) => {};
