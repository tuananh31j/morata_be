import { ROLE } from '@/constant/allowedRoles';
import { ORDER_STATUS } from '@/constant/order';
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

    const data = await Order.paginate(query, options);

    const orders = data.docs.map((order) => {
        return _.pick(order, [
            '_id',
            'totalPrice',
            'customerInfo',
            'paymentMethod',
            'isPaid',
            'orderStatus',
            'createdAt',
        ]);
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders: orders,
                page: data.page,
                totalDocs: data.totalDocs,
                totalPages: data.totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
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

    const data = await Order.paginate(query, options);
    const orders = data.docs.map((order) => {
        return _.pick(order, ['_id', 'totalPrice', 'paymentMethod', 'isPaid', 'orderStatus', 'createdAt']);
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders: orders,
                page: data.page,
                totalDocs: data.totalDocs,
                totalPages: data.totalPages,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

//@GET: Get the detailed order

export const getDetailedOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.params.id).lean();

    if (!order) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.params.id}`);
    }

    const result = _.omit(order, ['_id', 'updatedAt']);

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

    await order.save();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

//@POST Set order status to cancelled
export const cancelOrder = async (req: Request, res: Response, next: NextFunction) => {
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.CANCELLED) {
        throw new NotAcceptableError(`You cannot cancel this order because it was cancelled before. `);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.PENDING) {
        if (req.role === ROLE.ADMIN) {
            foundedOrder.canceledBy = ROLE.ADMIN;
        }

        foundedOrder.orderStatus = ORDER_STATUS.CANCELLED;
        foundedOrder.description = req.body.description ?? '';
        foundedOrder.save();
    } else {
        throw new NotAcceptableError(`Your order is shipping , you can not cancel.`);
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is cancelled.' }),
        );
};

// @Set order status to confirmed
export const confirmOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== 'admin') {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.PENDING) {
        foundedOrder.orderStatus = ORDER_STATUS.CONFIRMED;
        foundedOrder.save();
    } else {
        throw new BadRequestError(`Your order is confirmed.`);
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is confirmed.' }),
        );
};

// @Set order status to shipping
export const shippingOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== 'admin') {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({
        _id: req.body.orderId,
    });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.CONFIRMED) {
        foundedOrder.orderStatus = ORDER_STATUS.SHIPPING;
        await foundedOrder.save();
    } else {
        throw new BadRequestError(`Your order is not confirmed.`);
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: 'Your order is on delivery.',
        }),
    );
};

// @ Set order status to delivered
export const deliverOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== 'admin') {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.SHIPPING) {
        foundedOrder.orderStatus = ORDER_STATUS.DELIVERED;
        foundedOrder.save();
    } else {
        throw new BadRequestError(`Your order is delivered.`);
    }

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'This order is delivered.' }),
        );
};

// @Set order status to done
export const finishOrder = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.role || req.role !== 'admin') {
        throw new NotAcceptableError('Only admin can access.');
    }

    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.DELIVERED) {
        foundedOrder.orderStatus = ORDER_STATUS.DONE;
        foundedOrder.save();
    } else {
        throw new BadRequestError(`Your order is done.`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is done.' }));
};
