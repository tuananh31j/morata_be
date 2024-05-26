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

  if (!Product) {
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
      $lookup: {
        from: 'Review', // Foreign collection
        localField: '_id', // Field in Product that references Review
        foreignField: 'productId', // Field in Review that references Product
        as: 'reviews', // Name for the aggregated reviews
      },
    },
    {
      $unwind: '$reviews', // Deconstructs the reviews array into separate documents
    },
    {
      $group: {
        _id: '$_id', // Group by product ID
        name: { $first: '$name' }, // Get the first name from the grouped products
        reviewCount: { $sum: 1 }, // Count the number of reviews in the group
      },
    },
    {
      $sort: { reviewCount: -1 }, // Sort by review count in descending order (most reviews first)
    },
    {
      $limit: 5, // Limit to the top 5 products
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
export const getTopRelativeProducts = async (req: Request, res: Response, next: NextFunction) => {
  const topRelativeProducts = await Product.find({ _id: { $ne: req.body.productId }, isDeleted: false });

  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topRelativeProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
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
  const product = await Product.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { new: true });
  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
