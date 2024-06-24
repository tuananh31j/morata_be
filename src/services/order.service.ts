import { ORDER_STATUS } from '@/constant';
import { Role } from '@/constant/allowedRoles';
import { BadRequestError, NotAcceptableError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Order from '@/models/Order';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

type Options = {
  userId?: string;
  page: number;
  limit: number;
  sort?: { [key: string]: number };
  lean: boolean;

  //Filter properties
  search?: string;
  paymentMethod?: string;
  isPaid?: boolean;
  orderStatus?: string;
};

// @GET:  Get all orders

export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  let query: { isDeleted: boolean } = { isDeleted: false }; // Filter for non-deleted products

  // Build filter object based on request query parameters
  const filter: { [key: string]: any } = {};
  if (req.query.search) {
    const search = req.query.search as string;
    filter._id = { $regex: new RegExp(search, 'i') };
  }

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

//@GET: Get all orders by user

export const getAllOrdersByUser = async (req: Request, res: Response, next: NextFunction) => {
  let query: { isDeleted: boolean; userId: string } = { isDeleted: false, userId: req.userId }; // Filter for non-deleted products

  // Build filter object based on request query parameters
  const filter: { [key: string]: any } = {};

  if (req.query.search) {
    const search = req.query.search as string;
    filter._id = { $regex: new RegExp(search, 'i') };
  }

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

  const result = _.omit(order, ['_id', 'canceledBy', 'updatedAt']);

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: result, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @POST: Create new order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const order = new Order({
    ...req.body,
    userId: req.userId,
  });

  if (req.body.paymentMethod === 'cash') {
    if (req.body.totalPrice >= 1000) {
      return res.status(StatusCodes.NOT_ACCEPTABLE).json({ message: ReasonPhrases.NOT_ACCEPTABLE });
    }
    await order.save();
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

//@POST Cancel order
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
  const foundedOrder = await Order.findOne({ _id: req.body.orderId });

  if (!foundedOrder) {
    throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
  }

  if (foundedOrder.orderStatus === ORDER_STATUS.CANCELED) {
    throw new NotAcceptableError(`You cannot cancel this order because it was cancelled before. `);
  }

  if (foundedOrder.orderStatus === ORDER_STATUS.SHIPPING) {
    throw new NotAcceptableError(`Your order is shipping , you can not cancel.`);
  }

  if (req.role === Role.ADMIN) {
    foundedOrder.canceledBy = Role.ADMIN;
  }

  foundedOrder.orderStatus = ORDER_STATUS.CANCELED;
  foundedOrder.description = req.body.description ?? '';
  foundedOrder.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is cancelled.' }));
};

// @Confirm order

export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.role || req.role !== 'admin') {
    throw new NotAcceptableError('Only admin can access.');
  }

  const foundedOrder = await Order.findOne({ _id: req.body.orderId });

  if (!foundedOrder) {
    throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
  }

  if (foundedOrder.orderStatus === ORDER_STATUS.CONFIRMED) {
    throw new BadRequestError(`Your order is confirmed.`);
  }

  foundedOrder.orderStatus = ORDER_STATUS.CONFIRMED;
  foundedOrder.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is confirmed.' }));
};

// @Finish order
export const finishOrder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.role || req.role !== 'admin') {
    throw new NotAcceptableError('Only admin can access.');
  }

  const foundedOrder = await Order.findOne({ _id: req.body.orderId });

  if (!foundedOrder) {
    throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
  }

  if (foundedOrder.orderStatus === ORDER_STATUS.CONFIRMED) {
    throw new BadRequestError(`Your order is done.`);
  }

  foundedOrder.orderStatus = ORDER_STATUS.DONE;
  foundedOrder.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is done.' }));
};
