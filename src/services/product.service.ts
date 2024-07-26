import { queryClientFields } from '@/constant/queryField/product';
import { NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import ProductVariation from '@/models/ProductVariation';
import { IVariationPlayload } from '@/types/product';
import { removeUploadedFile, uploadFiles } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

const populateVariation = {
    path: 'variationIds',
    select: 'price image sku color productId stock',
    model: 'ProductVariation',
    options: { sort: 'price' },
};
const populateCategory = {
    path: 'categoryId',
    select: 'name',
    model: 'Category',
};

const clientRequiredFields = { isDeleted: false, isAvailable: true };

// @Get: getAllProducts
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    const features = new APIQuery(
        Product.find({ clientRequiredFields }).select(queryClientFields).populate(populateVariation),
        req.query,
    );
    features.filter().sort().limitFields().search().paginate();
    const data = await features.query;
    const totalDocs = await features.count();
    const totalPages = Math.ceil(Number(totalDocs) / page);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: data,
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

// @Get: getDetailedProduct
export const getDetailedProduct = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne(
        { _id: req.params.id, ...clientRequiredFields },
        { imageUrlRefs: 0, thumbnailUrlRef: 0 },
    ).populate(populateVariation);

    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
    }

    return product;
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
    const topLatestProducts = await Product.find(clientRequiredFields)
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
    const topDealsProducts = await Product.find(clientRequiredFields)
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
    const topReviewsProducts = await Product.find(clientRequiredFields)
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
        ...clientRequiredFields,
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
    const products = await Product.find({ categoryId: req.params.cateId, ...clientRequiredFields })
        .select(queryClientFields)
        .populate(populateVariation);

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: products, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get all products for admin
export const getAllProductAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    const features = new APIQuery(
        Product.find({ isDeleted: false }).populate(populateVariation).populate(populateCategory),
        req.query,
    );
    features.filter().sort().limitFields().search().paginate();

    const data = await features.query;
    const totalDocs = await features.count();
    const totalPages = Math.ceil(Number(totalDocs) / page);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: data,
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

// @Get hidden products for admin
export const getProductsHidden = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    const features = new APIQuery(
        Product.find({ isDeleted: false, isHide: true }).populate(populateVariation),
        req.query,
    );
    features.filter().sort().limitFields().search().paginate();

    const data = await features.query;
    const totalDocs = await features.count();
    const totalPages = Math.ceil(Number(totalDocs) / page);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: data,
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
// @Get active products for admin
export const getProductsActive = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    const features = new APIQuery(Product.find({ isDeleted: false }).populate(populateVariation), req.query);
    features.filter().sort().limitFields().search().paginate();

    const data = await features.query;
    const totalDocs = await features.count();
    const totalPages = Math.ceil(Number(totalDocs) / page);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: data,
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
