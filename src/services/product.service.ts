import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Product from '@/models/Product';
import { uploadFiles } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

type Options = {
  page: number;
  limit: number;
  sort: {
    createdAt: number;
  };
  lean: boolean;
};

// @Get: getAllProducts
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const query = { isDeleted: false };
  const options: Options = {
    page: req.query.page ? +req.query.page : 1,
    limit: req.query.limit ? +req.query.limit : 10,
    sort: { createdAt: -1 },
    lean: true,
  };

  const products = await Product.paginate(query, options);
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: products, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get: getDetailedProduct
export const getDetailedProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findOne({ _id: req.params.id, isDeleted: false }).lean();

  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
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
  const topRelativeProducts = await Product.find({ _id: { $ne: req.body.productId }, isDeleted: false })
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
    const thumbnailURL = await uploadFiles(files['thumbnail']);
    console.log(thumbnailURL);
    req.body.thumbnail = thumbnailURL[0];
  }

  if (files && files['images']) {
    const imagesURLs = await uploadFiles(files['images']);
    console.log(imagesURLs);
    req.body.images = imagesURLs;
  }

  const newProduct = new Product({ ...req.body });

  newProduct.save();

  return res.status(StatusCodes.CREATED).json(
    customResponse({
      data: newProduct,
      success: true,
      status: StatusCodes.CREATED,
      message: ReasonPhrases.CREATED,
    }),
  );
};

// @Patch: updateProduct
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, isDeleted: false },
    { ...req.body },
    { new: true },
  );

  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
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
