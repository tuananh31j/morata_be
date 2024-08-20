import { NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import { ItemOrder } from '@/interfaces/schema/order';
import Order from '@/models/Order';
import ReportReview from '@/models/ReportReview';
import Review from '@/models/Review';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Post create new review
export const createNewReview = async (req: Request, res: Response, next: NextFunction) => {
    const order = await Order.findById(req.body.orderId).lean();
    const newReview = new Review({ ...req.body });
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
                createAt: 1,
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

    const features = new APIQuery(
        ReportReview.find({})
            .select({
                content: 1,
                reason: 1,
                userId: 1,
                reviewId: 1,
                createAt: 1,
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
    const listReviews = await Review.find({ productId: req.query.productId as string })
        .populate('userId', 'name avatar _id')
        .lean();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: listReviews, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
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
    const review = await Review.deleteOne({ _id: req.params.id });
    // const reportReview = await ReportReview.deleteMany({ reviewId: req.params.id });

    if (!review) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} review with id: ${req.params.id}`);
    // if (!reportReview) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} report review with id: ${req.params.id}`);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Delete report review
export const deleteReportReview = async (req: Request, res: Response, next: NextFunction) => {
    const report = await ReportReview.deleteOne({ _id: req.params.id });

    if (!report) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} report review with id: ${req.params.id}`);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
