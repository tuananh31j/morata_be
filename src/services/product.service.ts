import { queryClientFields } from '@/constant/queryField/product';
import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import ProductVariation from '@/models/ProductVariation';
import { IVariationPlayload } from '@/types/product';
import { removeUploadedFile, uploadFiles } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import mongoose from 'mongoose';

const populateVariation = {
    path: 'variationIds',
    select: 'price image sku color productId stock',
    model: 'ProductVariation',
};
type PopulateOptions = {
    path: string;
    select?: string; // Specify which fields to include or exclude
    match?: Record<string, any>; // Additional criteria for filtering populated documents
    model?: string;
    options?: {
        sort?: Record<string, number>; // Sorting options for the populated documents
        limit?: number; // Limit the number of populated documents
    };
};

type Options = {
    page: number;
    limit: number;
    sort?: Record<string, number>;
    lean?: boolean;
    search?: string; // Filter by name (optional)
    price?: { min: number; max: number }; // Filter by price range (optional)
    isAvailable?: boolean; // Filter by availability (optional)
    brandId?: string; // Filter by brand (optional)
    categoryId?: string; // Filter by category (optional)
    rating?: { min: number; max: number }; // Filter by rating range (optional)
    populate?: PopulateOptions | PopulateOptions[]; // Populate options
};

// @Get: getAllProducts
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    let query: { isDeleted: boolean } = { isDeleted: false }; // Filter for non-deleted products
    // Build filter object based on request query parameters
    const filter: { [key: string]: any } = {};
    if (req.query.search) {
        const search = req.query.search as string;
        filter.name = { $regex: new RegExp(search, 'i') };
    }

    if (req.query.price) {
        const priceRange = JSON.parse(req.query.price as string); // Assuming price is provided as JSON string
        filter.price = { $gte: priceRange.min, $lte: priceRange.max }; // Filter by price range
    }
    if (req.query.isAvailable) {
        filter.isAvailable = Boolean(JSON.parse(req.query.isAvailable as string)); // Parse boolean value
    }
    if (req.query.brandId) {
        console.log(req.query.brandId);
        filter.brandId = req.query.brandId; // Filter by brand ID
    }
    if (req.query.categoryId) {
        filter.categoryId = req.query.categoryId; // Filter by category ID
    }
    if (req.query.rating) {
        const ratingRange = JSON.parse(req.query.rating as string);
        filter.rating = { $gte: ratingRange.min, $lte: ratingRange.max }; // Filter by rating range
    }

    // Combine filter with base query
    query = { ...query, ...filter };

    const options: Options = {
        page: req.query.page ? +req.query.page : 1,
        limit: req.query.limit ? +req.query.limit : 10,
        sort: req.query.sort ? JSON.parse(req.query.sort as string) : { createdAt: -1 }, // Parse sort criteria from JSON
        populate: populateVariation,
    };

    const data = await Product.paginate(query, options);
    const products = data.docs.map((item) => {
        return _.pick(item, ['_id', ...Object.keys(queryClientFields)]);
    });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: products,
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

// @Get: getDetailedProduct

export const getDetailedProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne(
        { _id: req.params.id, isDeleted: false },
        { imageUrlRefs: 0, thumbnailUrlRef: 0, variationIds: 0 },
    ).populate(populateVariation);

    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
    }

    return product;
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
    const topLatestProducts = await Product.find({ isDeleted: false })
        .select(queryClientFields)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate(populateVariation);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: topLatestProducts,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = async (req: Request, res: Response, next: NextFunction) => {
    const topDealsProducts = await Product.find({ isDeleted: false })
        .select(queryClientFields)
        .sort({ discountPercentage: 1 })
        .limit(2)
        .populate(populateVariation);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: topDealsProducts,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get Top Reviews
export const getTopReviewsProducts = async (req: Request, res: Response, next: NextFunction) => {
    const topReviewsProducts = await Product.find({ isDeleted: false })
        .populate(populateVariation)
        .select(queryClientFields)
        .sort({ reviewCount: -1 })
        .limit(5);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: topReviewsProducts,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get Top Hot Relative Products and the same category
export const getTopRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
    const topRelativeProducts = await Product.find({
        categoryId: req.query.cateId,
        isDeleted: false,
    })
        .select(queryClientFields)
        .populate(populateVariation)
        .limit(10)
        .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: topRelativeProducts,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get all products by category
export const getAllProductByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({ categoryId: req.params.cateId, isDeleted: false })
        .select(queryClientFields)
        .populate(populateVariation);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: products, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Post: createNewProduct
export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
    let variationObjs: any;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    if (files && files['thumbnail']) {
        const { fileUrlRefs, fileUrls } = await uploadFiles(files['thumbnail']);
        req.body.thumbnail = fileUrls[0];
        req.body.thumbnailUrlRef = fileUrlRefs[0];
    }

    if (files && files['images']) {
        const { fileUrlRefs, fileUrls } = await uploadFiles(files['images']);
        req.body.images = fileUrls;
        req.body.imageUrlRefs = fileUrlRefs;
    }
    if (files && files['variationImages']) {
        const { fileUrls, fileUrlRefs, originNames } = await uploadFiles(files['variationImages']);
        variationObjs = fileUrls.map((item, i) => {
            const variation = JSON.parse(req.body.variationsString).find((obj: IVariationPlayload) => {
                const originName = originNames[i];
                const fileName = obj.imageUrlRef;
                return fileName === originName;
            });
            if (variation) {
                return { ...variation, image: item, imageUrlRef: fileUrlRefs[i] };
            }
        });
    }

    const attributes = JSON.parse(req.body.attributes);
    delete req.body.variationImages;
    delete req.body.variationsString;

    // @add product
    const newProduct = await Product.create({ ...req.body, attributes });

    // @add variations to product
    const variations = variationObjs.map((item: IVariationPlayload) => {
        return { productId: newProduct._id, ...item };
    });

    // @add variation ids to product
    const newVariations = await ProductVariation.insertMany(variations);
    const variationIds = newVariations.map((variation) => variation._id);
    await Product.findByIdAndUpdate(
        newProduct._id,
        { $push: { variationIds: { $each: variationIds } } },
        { new: true },
    );

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

// @Patch: updateProduct
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
    }

    if (files && files['thumbnail']) {
        if (product.thumbnailUrlRef) {
            await removeUploadedFile(product.thumbnailUrlRef);
        }

        const { fileUrlRefs, fileUrls } = await uploadFiles(files['thumbnail']);
        req.body.thumbnail = fileUrls[0];
        req.body.thumbnailUrlRef = fileUrlRefs[0];
    }

    if (files && files['images']) {
        if (product.imageUrlRefs && product.imageUrlRefs.length) {
            for (let i = 0; i < product.imageUrlRefs.length; i++) {
                await removeUploadedFile(product.imageUrlRefs[i]);
            }
        }
        const { fileUrlRefs, fileUrls } = await uploadFiles(files['images']);
        req.body.images = fileUrls;
        req.body.imageUrlRefs = fileUrlRefs;
    }

    product.set({ ...product, ...req.body });
    product.save();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Delete: deleteProduct
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOneAndUpdate(
        { _id: req.params.id, isDeleted: false },
        { isDeleted: false },
        { new: true },
    );
    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
