import { ROLE } from '@/constant/allowedRoles';
import { ORDER_STATUS, PAYMENT_METHOD } from '@/constant/order';
import { BadRequestError, NotAcceptableError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import { ItemOrder } from '@/interfaces/schema/order';
import Order from '@/models/Order';
import { Content } from '@/template/Mailtemplate';
import { sendMail } from '@/utils/sendMail';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { inventoryService } from '.';
import APIQuery from '@/helpers/apiQuery';
import ProductVariation from '@/models/ProductVariation';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import config from '@/config/env.config';
// @GET:  Get all orders
export const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);
    const searchString = req.query.rawsearch;
    const searchQuery = searchString ? { 'customerInfo.name': { $regex: searchString, $options: 'i' } } : {};
    const features = new APIQuery(Order.find(searchQuery), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [orders, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders,
                page,
                totalDocs,
                totalPages,
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
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);

    const features = new APIQuery(Order.find({ userId }), req.query);
    features.filter().sort().limitFields().search().paginate();

    const [orders, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orders,
                page,
                totalDocs,
                totalPages,
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
    const addVariantResponse = async (product: any[]) => {
        return Promise.all(
            product.map(async (product) => {
                const variant = await ProductVariation.findById(product.productVariationId).select('variantAttributes');
                return {
                    ...product,
                    variant,
                };
            }),
        );
    };
    const items = await addVariantResponse(order.items);
    const result = _.omit(order, ['updatedAt']);
    const response = {
        ...result,
        items,
    };

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: response, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @POST: Create new order
export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    const order = new Order({
        ...req.body,
        userId: req.userId,
    });
    // Check stock before create order
    await inventoryService.checkProductStatus(req.body.items);

    const template: Content = {
        content: {
            title: 'Đơn hàng mới của bạn',
            description: 'Bạn vừa mới đặt một đơn hàng từ Morata dưới đây là sản phẩm bạn đã đặt:',
            email: req.body.customerInfo.email,
        },
        product: {
            items: req.body.items,
            shippingfee: req.body.shippingFee,
            totalPrice: req.body.totalPrice,
        },
        subject: '[MORATA] - Đơn hàng mới của bạn',
        link: {
            linkHerf: `${config.clientDomain.url}/my-orders/${order._id}`,
            linkName: `Kiểm tra đơn hàng`,
        },
        user: {
            name: req.body.receiverInfo.name,
            phone: req.body.receiverInfo.phone,
            email: req.body.receiverInfo.email,
            address: `[${req.body.shippingAddress.address}] - ${req.body.shippingAddress.ward}, ${req.body.shippingAddress.district}, ${req.body.shippingAddress.province}, Việt Nam`,
        },
    };
    await order.save();

    // Update stock
    await inventoryService.updateStockOnCreateOrder(req.body.items);
    await sendMail({ email: req.body.customerInfo.email, template, type: 'UpdateStatusOrder' });
    await Promise.all(
        req.body.items.map(async (product: any) => {
            await Cart.findOneAndUpdate(
                { userId: req.userId },
                { $pull: { items: { productVariation: product.productVariationId } } },
                { new: true },
            );
        }),
    );

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: req.body, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
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

    if (foundedOrder.orderStatus !== ORDER_STATUS.DELIVERED && foundedOrder.orderStatus !== ORDER_STATUS.DONE) {
        if (req.role !== ROLE.ADMIN && foundedOrder.orderStatus !== ORDER_STATUS.PENDING) {
            throw new NotAcceptableError('Bạn không được phép hủy đơn vui lòng liên hệ nếu có vấn đề');
        }
        if (req.role === ROLE.ADMIN) {
            foundedOrder.canceledBy = ROLE.ADMIN;
        }

        foundedOrder.orderStatus = ORDER_STATUS.CANCELLED;
        foundedOrder.description = req.body.description ?? '';
        foundedOrder.save();

        // Update stock
        await inventoryService.updateStockOnCancelOrder(foundedOrder.items);

        const template: Content = {
            content: {
                title: `${req.role === ROLE.ADMIN ? 'Đơn hàng của bạn đã bị hủy bởi admin' : 'Đơn hàng của bạn đã bị hủy'}`,
                description: `${req.role === ROLE.ADMIN ? `Đơn hàng của bạn đã bị hủy bởi admin với lý do ${foundedOrder.description} dưới đây là thông tin đơn hàng:` : `Bạn vừa hủy một đơn hàng với lý do ${foundedOrder.description} từ Morata thông tin đơn hàng:`}`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[MORATA] - Đơn hàng của bạn đã bị hủy',
            link: {
                linkHerf: `${config.clientDomain.url}/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({ email: foundedOrder.customerInfo.email, template, type: 'UpdateStatusOrder' });
    } else {
        throw new NotAcceptableError(`Đơn hàng của bạn đã được giao không thể hủy đơn`);
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
        const template: Content = {
            content: {
                title: `Đơn hàng của bạn đã được xác nhận`,
                description: `Đơn hàng của bạn đã được xác nhận bởi Morata. Đơn hàng sẽ được giao tới tay bạn khoảng 3-5 ngày. Dưới đây là thông tin đơn hàng của bạn`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[MORATA] - Đơn hàng của bạn đã được xác nhận',
            link: {
                linkHerf: `${config.clientDomain.url}/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({ email: foundedOrder.customerInfo.email, template, type: 'UpdateStatusOrder' });
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
        const template: Content = {
            content: {
                title: `Đơn hàng của bạn đang được giao`,
                description: `Đơn hàng của đang được giao tới bạn vui lòng để ý điện thoại. Dưới đây là thông tin đơn hàng của bạn:`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[MORATA] - Đơn hàng của bạn đang được giao',
            link: {
                linkHerf: `${config.clientDomain.url}/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({ email: foundedOrder.customerInfo.email, template, type: 'UpdateStatusOrder' });
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
        const template: Content = {
            content: {
                title: `Đơn hàng của bạn đã được giao`,
                description: `Đơn hàng của đã được giao tới bạn. Dưới đây là thông tin đơn hàng của bạn:`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                warning: `Nếu bạn chưa nhận được hàng vui lòng liên hệ tới email của shop: morata@shop.com. Nếu đã nhận được hàng bạn vui lòng lên xác nhận lại tại trang đơn hàng của bạn. Trong trường hợp bạn đã nhận được hàng dựa theo chính sách chúng tôi sẽ cập nhật đơn hàng sang trạng thái hoàn thành sau 3 ngày!`,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[MORATA] - Đơn hàng của bạn đã được giao',
            link: {
                linkHerf: `${config.clientDomain.url}/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({ email: foundedOrder.customerInfo.email, template, type: 'UpdateStatusOrder' });
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
    const foundedOrder = await Order.findOne({ _id: req.body.orderId });

    if (!foundedOrder) {
        throw new BadRequestError(`Not found order with id ${req.body.orderId}`);
    }

    if (foundedOrder.orderStatus === ORDER_STATUS.DELIVERED) {
        foundedOrder.orderStatus = ORDER_STATUS.DONE;
        foundedOrder.isPaid = true;
        foundedOrder.save();
        const template: Content = {
            content: {
                title: `Đơn hàng của đã hoàn tất`,
                description: `Đơn hàng của đã hoàn tất quá trình giao hàng. Dưới đây là thông tin đơn hàng của bạn:`,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
            },
            product: {
                items: foundedOrder.items,
                shippingfee: foundedOrder.shippingFee,
                totalPrice: foundedOrder.totalPrice,
            },
            subject: '[MORATA] - Đơn hàng của bạn đã hoàn tất',
            link: {
                linkHerf: `${config.clientDomain.url}/my-orders/${req.body.orderId}`,
                linkName: `Kiểm tra đơn hàng`,
            },
            user: {
                name:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.name
                        : foundedOrder.receiverInfo.name,
                phone:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.phone
                        : foundedOrder.receiverInfo.phone,
                email:
                    foundedOrder.paymentMethod === PAYMENT_METHOD.CARD
                        ? foundedOrder.customerInfo.email
                        : foundedOrder.receiverInfo.email,
                address: `[${foundedOrder.shippingAddress.address}] -${foundedOrder.paymentMethod === PAYMENT_METHOD.CARD ? '' : ` ${foundedOrder.shippingAddress.ward}, ${foundedOrder.shippingAddress.district},`} ${foundedOrder.shippingAddress.province}, ${foundedOrder.shippingAddress.country}`,
            },
        };
        await sendMail({ email: foundedOrder.customerInfo.email, template, type: 'UpdateStatusOrder' });
    } else {
        throw new BadRequestError(`Your order is done.`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: 'Your order is done.' }));
};

//@ update item to isReviewDisabled in order
export const disabledReview = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({ _id: req.body.productId })
        .select({
            isHide: 1,
            isDeleted: 1,
        })
        .lean();

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.body.productId}`);

    if (!product.isDeleted && !product.isHide) {
        return res.status(StatusCodes.OK).json(
            customResponse({
                data: {
                    isReviewable: true,
                    productId: req.body.productId,
                    orderId: req.body.orderId,
                    productVariationId: req.body.productVariationId,
                },
                success: true,
                status: StatusCodes.OK,
                message: ReasonPhrases.OK,
            }),
        );
    }

    const order = await Order.findById(req.body.orderId).lean();

    if (!order) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.body.orderId}`);

    const newItems = order?.items?.map((item: ItemOrder) =>
        item.productVariationId === req.body.productVariationId ? { ...item, isReviewDisabled: true } : item,
    );

    await Order.updateOne({ _id: req.body.orderId }, { items: newItems }, { new: true });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                orderId: req.body.orderId,
                isReviewable: false,
                productId: req.body.productId,
                productVariationId: req.body.productVariationId,
            },
            success: true,
            status: StatusCodes.OK,
            message: 'Sản phẩm đã bị ẩn hoặc hiện tại đang tạm dừng bán!',
        }),
    );
};
