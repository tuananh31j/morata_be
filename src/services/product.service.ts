import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import { removeUploadedFile, uploadFiles } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

type Options = {
  page: number;
  limit: number;
  sort?: { [key: string]: number };
  lean: boolean;
  // Filter properties
  search?: string; //Filter by name (optional)
  price?: { min: number; max: number }; // Filter by price range (optional)
  isAvailable?: boolean; // Filter by availability (optional)
  brandId?: string; // Filter by brand (optional)
  categoryId?: string; // Filter by category (optional)
  rating?: { min: number; max: number }; // Filter by rating range (optional)
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
    lean: true,
  };

  const data = await Product.paginate(query, options);
  const products = data.docs.map((item) => {
    return _.pick(item, [
      '_id',
      'name',
      'price',
      'discountPercentage',
      'rating',
      'categoryId',
      'brandId',
      'stock',
      'images',
      'thumbnail',
      'reviewIds',
    ]);
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
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false }).lean();

  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return product;
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
  const topLatestProducts = await Product.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(10).lean();
  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topLatestProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = async (req: Request, res: Response, next: NextFunction) => {
  const topDealsProducts = await Product.find({ isDeleted: false }).sort({ discountPercentage: 1 }).limit(2).lean();
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: topDealsProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get Top Reviews
export const getTopReviewsProducts = async (req: Request, res: Response, next: NextFunction) => {
  const aggregationPipeline = [
    {
      $project: {
        _id: 1,
        reviewCount: { $size: '$reviewIds' },
        name: 1,
        description: 1,
        price: 1,
        discountPercentage: 1,
        rating: 1,
        stock: 1,
        images: 1,
        thumbnail: 1,
        brandId: 1,
        reviewIds: 1,
        isAvailable: 1,
        variations: 1,
      },
    },
    {
      $sort: { reviewCount: -1 },
    },
    {
      $limit: 5,
    },
  ];

  const topReviewsProducts = await Product.aggregate(aggregationPipeline as any[]);
  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topReviewsProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Get Top Hot Relative Products and the same category
export const getTopRelatedProducts = async (req: Request, res: Response, next: NextFunction) => {
  const topRelativeProducts = await Product.find({
    _id: { $ne: req.query.id },
    categoryId: req.query.cateId,
    isDeleted: false,
  })
    .limit(10)
    .sort({ createdAt: -1 });

  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topRelativeProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Get all products by category
export const getAllProductByCategory = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({ categoryId: req.params.cateId, isDeleted: false });

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: products, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Post: createNewProduct
export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
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

  const newProduct = new Product({ ...req.body });

  newProduct.save();

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
  const product = await Product.findOneAndUpdate({ _id: req.params.id, isDeleted: true }, { new: true });
  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
