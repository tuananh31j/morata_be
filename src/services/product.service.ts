import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import ProductItem from '@/models/ProductItem';
import { removeUploadedFile, uploadFiles } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

// @Post: createNewProduct
export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  let items: any[] = [];

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

  const newProduct = new Product({
    name: req.body.name,
    description: req.body.description,
    discount: req.body.discount,
    basePrice: req.body.basePrice,
    images: req.body.images,
    imageUrlRefs: req.body.imageUrlRefs,
    thumbnail: req.body.thumbnail,
    thumbnailUrlRef: req.body.thumbnailUrlRef,
    categoryId: req.body.categoryId,
    parentSku: req.body.parentSku,
  });

  newProduct.save();

  if (newProduct && req.body.items && req.body.items.length) {
    items = req.body.items.forEach(async (item: any) => {
      const newProductItem = new ProductItem({
        ...item,
        productId: newProduct._id,
        price: item.price,
        stock: item.stock,
        sku: item.sku,
        details: item.details,
        variations: item.variations,
      });

      newProductItem.save();
    });
  }

  return { newProduct };
};

// @Get: Get All Product Homepage
export const getProductsHomePage = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({ isDeleted: false }).lean();
  return products;
};

// @Get: Get All Products in Filter Page

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

export const getAllProductsFilterPage = async (req: Request, res: Response, next: NextFunction) => {
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

  const data = await ProductItem.paginate(query, options);

  return data;
};

// @Get: getDetailedProduct
export const getDetailedProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false }).lean();
  const productItems = await ProductItem.find({ productId: req.params.id, isDeleted: false }).lean();

  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return { product, productItems };
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
  const result = await ProductItem.find({ isDeleted: false })
    .populate('productId')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const topLatestProducts = result.map((item) => {
    return _.pick(item.productId, ['_id', 'name', 'description', 'price', 'discount', 'images', 'thumbnail']);
  });

  return topLatestProducts;
};

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = async (req: Request, res: Response, next: NextFunction) => {
  const result = await ProductItem.find({ isDeleted: false })
    .populate('productId')
    .sort({ discountPercentage: 1 })
    .limit(2)
    .lean();

  const topDealsProducts = result.map((item) => {
    return _.pick(item.productId, ['_id', 'name', 'description', 'price', 'discount', 'images', 'thumbnail']);
  });

  return topDealsProducts;
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
        discount: 1,
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

  const result = await ProductItem.aggregate(aggregationPipeline as any[]);

  const topReviewsProducts = result.map((item) => {
    return _.pick(item.productId, ['_id', 'name', 'description', 'price', 'discount', 'images', 'thumbnail']);
  });

  return topReviewsProducts;
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

  const productItem = await Product.findById(req.params.productItemId).lean();
  if (!productItem) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product item with id: ${req.params.productItemId}`);
  }

  productItem.set({ ...productItem, ...req.body });
  productItem.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
