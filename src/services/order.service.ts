import { ORDER_STATUS } from '@/constant';
import { Role } from '@/constant/allowedRoles';
import { BadRequestError, NotAcceptableError, NotFoundError } from '@/error/customError';
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
    filter.orderStatus = req.query.orderStatus;
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
  const order = await Order.findById(req.params.id).lean();

  if (!order) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.params.id}`);
  }

  const result = _.omit(order, ['_id', 'userId', 'canceledBy', 'updatedAt']);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: result, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @POST: Create new order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const newOrders = new Order({
    ...req.body,
    userId: req.userId,
  });

  if (req.body.paymentMethod === 'cash') {
    if (req.body.totalPrice >= 1000) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: ReasonPhrases.NOT_ACCEPTABLE });
    }
    await newOrders.save();
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

//@POST Cancel order
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  const foundedOrder = await Order.findOne({ userId: req.userId as string, _id: req.body.orderId });

  if (!foundedOrder) {
    throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
  }

  if (foundedOrder.orderStatus === ORDER_STATUS.CANCELLED) {
    throw new NotAcceptableError(`You cannot cancel this order because it was cancelled before. `);
  }

  if (foundedOrder.orderStatus === ORDER_STATUS.SHIPPING) {
    throw new NotAcceptableError(`Your order is shipping , you can not cancel.`);
  }

  if (req.role === Role.ADMIN) {
    foundedOrder.canceledBy = Role.ADMIN;
  }

  foundedOrder.orderStatus = ORDER_STATUS.CANCELLED;
  foundedOrder.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is cancelled.' }));
};
