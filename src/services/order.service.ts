import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Order from '@/models/Order';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

//@GET: Get all orders by user

type Options = {
  userId: string;
  page: number;
  limit: number;
  sort?: { [key: string]: number };
  lean: boolean;

  //Filter properties
  paymentMethod?: string;
  isPaid?: boolean;
  orderStatus?: string;
};

export const getAllOrdersByUser = async (req: Request, res: Response, next: NextFunction) => {
  let query: { isDeleted: boolean } = { isDeleted: false }; // Filter for non-deleted products

  // Build filter object based on request query parameters
  const filter: { [key: string]: any } = {};

  if (req.query.paymentMethod) {
    filter.paymentMethod = req.query.paymentMethod;
  }

  if (req.query.isPaid) {
    filter.isPaid = req.query.isPaid;
  }

  if (req.query.orderStatus) {
    filter.isPaid = req.query.orderStatus;
  }

  const options: Options = {
    userId: req.userId!,
    page: req.query.page ? +req.query.page : 1,
    limit: req.query.limit ? +req.query.limit : 10,
    sort: req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 }, // Parse sort criteria from JSON
    lean: true,
  };

  query = { ...query, ...filter };

  const orders = (await Order.paginate(query, options)).docs.map((order) => {
    return _.pick(order, ['_id', 'totalPrice', 'paymentMethod', 'isPaid', 'orderStatus', 'createdAt']);
  });

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: orders, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

//@GET: Get the detailed order

export const getDetailedOrder = async (req: Request, res: Response, next: NextFunction) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: order, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @POST: Create new order
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
