import { NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import { ItemOrder } from '@/interfaces/schema/order';
import Order from '@/models/Order';
import Product from '@/models/Product';
import ReportReview from '@/models/ReportReview';
import Review from '@/models/Review';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Post create new review
export const createNewReview = async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.body.orderId).lean();
    const newReview = new Review({ ...req.body });
    await newReview.save();

    if (!order) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} order with id: ${req.body.orderId}`);

    console.log('productVariationId', req.body.productVariationId);
    const newItems = order?.items?.map((item: ItemOrder) =>
        item.productVariationId === req.body.productVariationId ? { ...item, isReviewed: true } : item,
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
// @Post create new review
export const createNewReport = async (req: Request, res: Response, next: NextFunction) => {
    const createReport = new ReportReview(req.body);
    createReport.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
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
export const getAllReviews = async (req: Request, res: Response, next: NextFunction) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);

    const features = new APIQuery(
        Review.find({})
            .select({
                content: 1,
                rating: 1,
                userId: 1,
                productId: 1,
                createdAt: 1,
            })
            .populate('userId', 'name  _id'),
        req.query,
    );
    features.paginate().sort().filter().search();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                reviewList: data,
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
// @Get all review is reported
export const getAllReviewsIsReported = async (req: Request, res: Response, next: NextFunction) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);

    const query = req.query.rawsearch ? { reviewId: req.query.rawsearch } : {};

    const features = new APIQuery(
        ReportReview.find(query)
            .select({
                content: 1,
                reason: 1,
                userId: 1,
                reviewId: 1,
                createdAt: 1,
            })
            .populate('userId', 'name _id'),
        req.query,
    );
    features.paginate().sort().filter().search();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                reportList: data,
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

// @Get all review
export const getAllReviewsByFilters = async (req: Request, res: Response, next: NextFunction) => {
    const listReviews = await Review.find({ rating: req.params.rating }).populate('userId', 'name avatar _id').lean();
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: listReviews, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get all review of product
export const getAllReviewsOfProduct = async (req: Request, res: Response, next: NextFunction) => {
    // const listReviews = await Review.find({ productId: req.query.productId as string, rating: { $gte: 4 } })
    //     .populate('userId', 'name avatar _id')
    //     .sort({ createdAt: -1 })
    //     .lean();
    const limit = 10;
    req.query.limit = String(req.query.limit || limit);

    const features = new APIQuery(
        Review.find({ productId: req.query.productId as string })
            .populate('userId', 'name  avatar _id')
            .sort({ createdAt: -1 }),
        req.query,
    );
    features.paginate().sort().filter();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                reviewList: data,
                totalDocs,
                limit,
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get 1 star to 5 star review of product
export const getAllStarsReview = async (req: Request, res: Response, next: NextFunction) => {
    const listReviews = await Review.find({ productId: req.params.productId }).lean();

    if (!listReviews) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} with product id ${req.query.productId}`);

    const fiveRatingCount = listReviews?.filter((item) => item.rating > 4).length;
    const fourRatingCount = listReviews?.filter((item) => item.rating < 5 && item.rating > 3).length;
    const threeRatingCount = listReviews?.filter((item) => item.rating < 4 && item.rating > 2).length;
    const twoRatingCount = listReviews?.filter((item) => item.rating < 3 && item.rating > 1).length;
    const oneRatingCount = listReviews?.filter((item) => item.rating < 2 && item.rating > 0).length;

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                countReview: listReviews.length,
                starsReview: [
                    { count: fiveRatingCount, star: 5 },
                    { count: fourRatingCount, star: 4 },
                    { count: threeRatingCount, star: 3 },
                    { count: twoRatingCount, star: 2 },
                    { count: oneRatingCount, star: 1 },
                ],
            },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get detail review
export const getDetailReviewsOfProduct = async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findById(req.params.id).populate('userId', 'name avatar -_id').lean();
    if (!review) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} review with id: ${req.params.id}`);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: review, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Delete review
export const deleteReview = async (req: Request, res: Response, next: NextFunction) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    const product = await Product.findById(review?.productId);
    const reviews = await Review.find({ productId: review?.productId });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    const reviewCount = reviews.length;

    if (!review) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} review with id: ${req.params.id}`);
    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${review?.productId}`);

    await Product.updateOne({ _id: review?.productId }, { rating: averageRating, reviewCount: reviewCount });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Delete report review
export const deleteReportReview = async (req: Request, res: Response, next: NextFunction) => {
    const report = await ReportReview.deleteOne({ _id: req.params.id });

    if (!report) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} report review with id: ${req.params.id}`);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
