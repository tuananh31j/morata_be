import { ORDER_STATUS } from '@/constant/order';
import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import { ItemOrder, OrderSchema } from '@/interfaces/schema/order';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Post create new review
export const createNewReview = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.body.productId);
    const order = await Order.findById(req.body.orderId).lean();

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.body.productId}`);
    const newReview = new Review({ ...req.body });
    // product?.reviewIds.push(newReview._id as any);
    await product?.save();
    await newReview.save();

    if (!order) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.body.productId}`);

    const newItems = order?.items?.map((item: ItemOrder) =>
        item.productId === req.body.productId ? { ...item, isReviewed: true } : item,
    );

    await Order.updateOne({ _id: req.body.orderId }, { items: newItems }, { new: true });

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newReview,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

// @Patch update review
export const updateReview = async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!review) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} review with id: ${req.params.id}`);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: review,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get all review
export const getAllReviewsOfProduct = async (req: Request, res: Response, next: NextFunction) => {
    const listReviews = await Review.find({ productId: req.query.productId as string })
        .populate('userId', 'username avatar _id')
        .lean();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: listReviews, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get detail review
export const getDetailReviewsOfProduct = async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id).populate('userId', 'username avatar -_id').lean();
    if (!review) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} review with id: ${req.params.id}`);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: review, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get count review
// export const countPurchasedProductByUser = async (req: Request, res: Response, next: NextFunction) => {
//     const orders = await Order.find({ userId: req.query.userId, status: ORDER_STATUS.DONE }).lean();
//     let count = 0;

//     orders.forEach((order) => {
//         const orderFound = order.items?.filter(
//             (item) => item.productId === req.query.productId && item.isReviewed === false,
//         );
//         count += orderFound.length;
//     });
//     return res
//         .status(StatusCodes.OK)
//         .json(customResponse({ data: { count }, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
// };
