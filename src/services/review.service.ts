import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import Review from '@/models/Review';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createNewReview = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findById(req.body.productId);
    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.body.productId}`);
    const newReview = new Review({ ...req.body });
    product?.reviewIds.push(newReview._id as any);
    await product?.save();
    await newReview.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: newReview,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

export const getAllReviewsOfProduct = async (req: Request, res: Response, next: NextFunction) => {
    const listReviews = await Review.find({ productId: req.query.productId as string })
        .populate('userId', 'username avatar -_id')
        .lean();

    return res
        .status(StatusCodes.CREATED)
        .json(customResponse({ data: listReviews, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
