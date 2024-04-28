import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import { Product } from '@/models';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getAllProducts
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  const products = await Product.find({}).lean();
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: products, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get: getDetailedProduct
export const getDetailedProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.params.id).lean();

  if (!Product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
  const topLatestProducts = await Product.find({}).sort({ createdAt: -1 }).limit(10);
  if (topLatestProducts.length < 1) throw new NotFoundError('Not Found Product');
  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topLatestProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = async (req: Request, res: Response, next: NextFunction) => {
  const topDealsProducts = await Product.find({}).sort({ discountPercentage: 1 }).limit(2);
  if (topDealsProducts.length < 1) throw new NotFoundError('Not Found Product');
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: topDealsProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get Top Reviews
export const getTopReviewsProducts = async (req: Request, res: Response, next: NextFunction) => {
  const aggregationPipeline = [
    {
      $lookup: {
        from: 'Review', // Replace with your review collection name
        localField: '_id',
        foreignField: 'product',
        as: 'reviews',
      },
    },
    {
      $unwind: '$reviews', // Unwind the 'reviews' array
    },
    {
      $group: {
        _id: '$_id',
        product: { $first: '$name' }, // Replace with desired product property
        numReviews: { $sum: 1 }, // Count the number of reviews
      },
    },
    {
      $sort: { numReviews: -1 }, // Sort by 'numReviews' in descending order
    },
    {
      $limit: 10, // Limit the results to 10 documents
    },
  ];

  const topReviewsProducts = await Product.aggregate(aggregationPipeline as any[]);
  if (topReviewsProducts.length < 1) throw new NotFoundError('Not Found Product');
  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topReviewsProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Get Top Hot Relative Products and the same category
export const getTopRelativeProducts = async (req: Request, res: Response, next: NextFunction) => {
  const topRelativeProducts = await Product.find({
    category: req.params.cateId,
    _id: { $ne: req.params.id },
  })
    .sort({ createdAt: -1 })
    .limit(10);
  if (topRelativeProducts.length < 1) throw new NotFoundError('Not Found Product');
  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topRelativeProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Post: createNewProduct
export const createNewProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.create({ ...req.body });

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: product, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};

// @Patch: updateProduct
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

  if (!Product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Delete: deleteProduct
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND}/ID: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
