import { ORDER_STATUS } from '@/constant/order';
import { BadRequestError, NotAcceptableError, NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Order from '@/models/Order';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import generateOrderStatusLog from '@/utils/generateOrderStatusLog';
import { ROLE } from '@/constant/allowedRoles';

// @GET:  Get all orders
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    const page = Number(req.query.page) || 1;

    const features = new APIQuery(Order.find(), req.query);
    features.filter().sort().limitFields().search().paginate();

    const data = await features.query;

    const totalDocs = await features.count();
    const totalPages = Math.ceil(totalDocs / page);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders: data,
                page: page,
                totalDocs: totalDocs,
                totalPages: totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@GET: Get all orders by user
export const getAllOrdersByUser = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const page = Number(req.query.page) || 1;

    const features = new APIQuery(Order.find({ userId }).select(['-customerInfo', '-updatedAt']), req.query);
    features.filter().sort().limitFields().search().paginate();

    const data = await features.query;

    const totalDocs = await features.count();
    const totalPages = Math.ceil(totalDocs / page);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders: data,
                page: page,
                totalDocs: totalDocs,
                totalPages: totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@GET: Get the detailed my order
export const getDetailedOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).select(['-customerInfo', '-updatedAt']);

    if (!order) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.params.id}`);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: order, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
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

//@POST Set order status to cancelled
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const foundedOrder = await Order.findOneAndUpdate(
        {
            _id: req.body.orderId,
            currentOrderStatus: ORDER_STATUS.PENDING,
        },
        {
            $push: {
                OrderStatusLogs: generateOrderStatusLog({
                    statusChangedBy: req.userId,
                    orderStatus: ORDER_STATUS.CANCELLED,
                    reason: req.body.reason,
                }),
            },
            $set: { currentOrderStatus: ORDER_STATUS.CANCELLED },
        },
    );

    if (!foundedOrder) {
        throw new BadRequestError(
            `Not found order with id ${req.body.orderId} or status is not ${ORDER_STATUS.PENDING}.`,
        );
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is cancelled.' }),
        );
};

// @Set order status to confirmed
export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== ROLE.ADMIN) {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOneAndUpdate(
        {
            _id: req.body.orderId,
            currentOrderStatus: ORDER_STATUS.PENDING,
        },
        {
            $push: {
                OrderStatusLogs: generateOrderStatusLog({
                    statusChangedBy: req.userId,
                    orderStatus: ORDER_STATUS.CONFIRMED,
                    reason: req.body.reason,
                }),
            },
            $set: { currentOrderStatus: ORDER_STATUS.CONFIRMED },
        },
    );
    if (!foundedOrder) {
        throw new BadRequestError(
            `Not found order with id ${req.body.orderId} or status is not ${ORDER_STATUS.PENDING}.`,
        );
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is confirmed.' }),
        );
};

// @ Set order status to delivered
export const shippingOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== ROLE.ADMIN) {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOneAndUpdate(
        {
            _id: req.body.orderId,
            currentOrderStatus: ORDER_STATUS.CONFIRMED,
        },
        {
            $push: {
                OrderStatusLogs: generateOrderStatusLog({
                    statusChangedBy: req.userId,
                    orderStatus: ORDER_STATUS.SHIPPING,
                    reason: req.body.reason,
                }),
            },
            $set: { currentOrderStatus: ORDER_STATUS.SHIPPING },
        },
    );

    if (!foundedOrder) {
        throw new BadRequestError(
            `Not found order with id ${req.body.orderId} or status is not ${ORDER_STATUS.CONFIRMED}.`,
        );
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'This order is shipping.' }),
        );
};

// @Set order status to delivered
export const deliverOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== ROLE.ADMIN) {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOneAndUpdate(
        {
            _id: req.body.orderId,
            currentOrderStatus: ORDER_STATUS.SHIPPING,
        },
        {
            $push: {
                OrderStatusLogs: generateOrderStatusLog({
                    statusChangedBy: req.userId,
                    orderStatus: ORDER_STATUS.DELIVERED,
                    reason: req.body.reason,
                }),
            },
            $set: { currentOrderStatus: ORDER_STATUS.DELIVERED },
        },
    );

    if (!foundedOrder) {
        throw new BadRequestError(
            `Not found order with id ${req.body.orderId} or status is not ${ORDER_STATUS.SHIPPING}.`,
        );
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: `This order is ${ORDER_STATUS.DELIVERED}.`,
        }),
    );
};

// @Set order status to done
export const finishOrder = async (req: Request, res: Response, next: NextFunction) => {
    const foundedOrder = await Order.findOneAndUpdate(
        {
            _id: req.body.orderId,
            currentOrderStatus: ORDER_STATUS.DELIVERED,
            userId: req.userId,
        },
        {
            $push: {
                OrderStatusLogs: generateOrderStatusLog({
                    statusChangedBy: req.userId,
                    orderStatus: ORDER_STATUS.DONE,
                    reason: req.body.reason,
                }),
            },
            $set: { currentOrderStatus: ORDER_STATUS.DONE },
        },
    );

    if (!foundedOrder) {
        throw new BadRequestError(
            `Not found order with id ${req.body.orderId} or status is not ${ORDER_STATUS.CONFIRMED}.`,
        );
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: `This order is ${ORDER_STATUS.DONE}.`,
        }),
    );
};
