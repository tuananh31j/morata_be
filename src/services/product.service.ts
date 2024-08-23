import { AttributeType } from '@/constant/attributeType';
import { queryClientFields } from '@/constant/queryField/product';
import { NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import Category from '@/models/Category';
import Product from '@/models/Product';
import ProductVariation from '@/models/ProductVariation';
import { IVariationPlayload } from '@/types/product';
import { removeUploadedFile, uploadFiles } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

const populateVariation = {
    path: 'variationIds',
    select: 'price image sku productId stock sold variantAttributes imageUrlRef isActive',
    model: 'ProductVariation',
    options: { sort: 'price' },
};
const populateCategory = {
    path: 'categoryId',
    model: 'Category',
};
const populateBrand = {
    path: 'brandId',
    model: 'Brand',
};
const clientRequiredFields = { isDeleted: false, isAvailable: true, isHide: false };

// query attribute conversion function for attribute and variant
const transformQuery = (query: any): { attributeQuery: any; variantQuery: any } => {
    const queryCopy: any = { ...query };
    //Delete key not attribute or variant
    delete queryCopy['price'];
    delete queryCopy['sort'];

    const attributeQueries: any[] = [];
    const variantQueries: any[] = [];

    Object.keys(queryCopy).forEach((key) => {
        const values = queryCopy[key].split(',').map((item: any) => item.split('-').join(' '));

        if (values[0] === 'variant') {
            const variantValues = values.slice(1);
            variantQueries.push({
                variantAttributes: { $elemMatch: { key, value: { $in: variantValues } } },
            });
        } else {
            attributeQueries.push({
                attributes: { $elemMatch: { key, value: { $in: values } } },
            });
        }
    });

    const combinedVariantQuery = variantQueries.length > 0 ? { $and: variantQueries } : {};
    const combinedAttributeQuery = attributeQueries.length > 0 ? { $and: attributeQueries } : {};

    return { attributeQuery: combinedAttributeQuery, variantQuery: combinedVariantQuery };
};

// @Get: getAllProducts
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);
    const queryCopy = { ...req.query };

    Object.keys(queryCopy).forEach((el) => {
        if (!el.includes('raw')) {
            delete queryCopy[el];
        }
    });
    let queryStr = JSON.stringify(queryCopy);
    // Remove the word "raw"
    queryStr = queryStr.replace(/\braw/g, '');
    // Replace comparison operators
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // convert back to object
    const queryVariant = JSON.parse(queryStr);
    const filterPrice = queryVariant.price ? { price: queryVariant.price } : {};
    const sortPrice = queryVariant.sort ? { sort: queryVariant.sort } : { sort: 'price' };
    const queryTransformed = transformQuery(queryVariant);

    const populateVariantAndFilter = {
        ...populateVariation,
        match: { ...queryTransformed.variantQuery, ...filterPrice },
        options: sortPrice,
    };

    const features = new APIQuery(
        Product.find({ ...clientRequiredFields, ...queryTransformed.attributeQuery })
            .populate(populateVariantAndFilter)
            .select(queryClientFields)
            .lean(),
        req.query,
    );

    features.filter().sort().limitFields().search().paginate();
    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalDocsValid = { value: totalDocs };

    const filteredData = data.filter((item) => {
        if (item.variationIds.length === 0) {
            totalDocsValid.value -= 1;
        }
        return item.variationIds.length > 0;
    });
    filteredData.sort((a, b) => {
        const priceA = (a.variationIds[0] as any).price;
        const priceB = (b.variationIds[0] as any).price;
        if (queryVariant.sort === 'price') return priceA - priceB;
        return priceB - priceA;
    });
    const totalPages = Math.ceil(Number(totalDocsValid.value) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                products: filteredData,
                length: data.length,
                page: page,
                totalDocs: totalDocsValid.value,
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
    )
        .populate(populateVariation)
        .populate(populateCategory)
        .populate(populateBrand);

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);

    return product;
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
    const topLatestProducts = await Product.find(clientRequiredFields)
        .select(queryClientFields)
        .sort({ createdAt: -1 })
        .limit(10)
        .populate(populateVariation)
        .lean();
    const filteredData = topLatestProducts.filter((item) => item.variationIds.length > 0);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: filteredData,
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

// @Get: getDetailedProduct for admin
export const getDetailedProductAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({ _id: req.params.id })
        .populate(populateVariation)
        .populate(populateCategory)
        .populate(populateBrand);

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
// @Get: getDetailed Product for review
export const getDetailedProductReview = async (req: Request, res: Response, next: NextFunction) => {
    const product = await Product.findOne({ _id: req.params.id }).select({
        isHide: 1,
        isDeleted: 1,
    });

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get all products for admin
export const getAllProductAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const page = req.query.page ? +req.query.page : 1;
    const features = new APIQuery(
        Product.find().populate(populateVariation).populate(populateCategory).populate(populateBrand),
        req.query,
    );
    features.filter().sort().limitFields().search().paginate();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
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
            const variation = req.body.variationsString.find((obj: IVariationPlayload) => {
                const originName = originNames[i];
                const fileName = obj.imageUrlRef;
                return fileName === originName;
            });
            if (variation) {
                return { ...variation, image: item, imageUrlRef: fileUrlRefs[i] };
            }
        });
    }

    const attributes = req.body.attributes;
    delete req.body.variationImages;
    delete req.body.variationsString;

    // @add product
    const newProduct = new Product({ ...req.body, attributes });

    // @generate variations
    const variations = variationObjs.map((item: IVariationPlayload) => {
        return { productId: newProduct._id, ...item };
    });

    // @add variation ids to product
    const newVariations = await ProductVariation.insertMany(variations);
    const variationIds = newVariations.map((variation) => variation._id);
    newProduct.set({ variationIds: variationIds });
    await newProduct.save();

    return res.status(StatusCodes.CREATED).json(
        customResponse({
            data: { newProduct, variationObjs, variations },
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

// @Patch: updateProduct
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const product = await Product.findById(req.params.id);

    // @Keep old images
    const { oldImageRefs, oldImages } = req.body;

    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);

    if (files && files['thumbnail']) {
        if (product.thumbnailUrlRef) await removeUploadedFile(product.thumbnailUrlRef);

        const { fileUrlRefs, fileUrls } = await uploadFiles(files['thumbnail']);
        req.body.thumbnail = fileUrls[0];
        req.body.thumbnailUrlRef = fileUrlRefs[0];
    }

    if (files && files['images']) {
        const { fileUrlRefs, fileUrls } = await uploadFiles(files['images']);
        req.body.images = [...oldImages, ...fileUrls];
        req.body.imageUrlRefs = [...oldImageRefs, ...fileUrlRefs];
    } else {
        if (product.imageUrlRefs && product.imageUrlRefs.length) {
            // @Remove images not in oldImageRefs
            await Promise.all(
                product.imageUrlRefs
                    .filter((imageUrlRef) => !oldImageRefs.includes(imageUrlRef))
                    .map((imageUrlRef) => removeUploadedFile(imageUrlRef)),
            );
            req.body.images = oldImages;
            req.body.imageUrlRefs = oldImageRefs;
        }
    }
    product.set({ ...req.body });
    await product.save();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Patch: updateProduct variation
export const updateProductVariation = async (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const productVariation = await ProductVariation.findById(req.params.variationId);
    const variant = req.body.variantString ? JSON.parse(req.body.variantString) : {};
    if (!productVariation)
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product variation with id: ${req.params.variationId}`);

    if (files && files['image']) {
        if (productVariation.imageUrlRef) await removeUploadedFile(productVariation.imageUrlRef);

        const { fileUrlRefs, fileUrls } = await uploadFiles(files['image']);
        variant.image = fileUrls[0];
        variant.imageUrlRef = fileUrlRefs[0];
    }
    productVariation.set({ ...variant });
    await productVariation.save();

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: productVariation,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Post: updateProduct variation
export const addNewVariationToProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.body.productId;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const product = await Product.findById(productId);
    const variant = req.body.variantString ? JSON.parse(req.body.variantString) : {};
    if (!product) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${productId}`);

    if (files && files['image']) {
        const { fileUrlRefs, fileUrls } = await uploadFiles(files['image']);
        variant.image = fileUrls[0];
        variant.imageUrlRef = fileUrlRefs[0];
    }

    const newVariation = await ProductVariation.create({ ...variant, productId });
    product.set({ variationIds: [...product.variationIds, newVariation._id] });
    await product.save();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: product,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @PATCH: hiddenProduct
export const hiddenProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const product = await Product.findOneAndUpdate({ _id: productId, isHide: false }, { isHide: true }, { new: true });

    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${productId}`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
// @PATCH: showProduct
export const showProduct = async (req: Request, res: Response, next: NextFunction) => {
    const productId = req.params.productId;
    const product = await Product.findOneAndUpdate({ _id: productId, isHide: true }, { isHide: false }, { new: true });

    if (!product) {
        throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${productId}`);
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

//GET: filterProductsBycategory
export const filterProductsBycategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId || null;
    const category = await Category.findById(categoryId, { attributeIds: 1 }).populate('attributeIds').lean();
    if (!category) throw new NotFoundError('Category not found');
    const filteredAttributes = category.attributeIds.filter((attr: any) => {
        return attr.isFilter === true;
    });
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: filteredAttributes,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};
