import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import { Product } from '@/models';
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
  const query = { deleted: false };
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
  const product = await Product.findOne({ _id: req.params.id, deleted: false }).lean();

  if (!Product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: product, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get Top Latest Products
export const getTopLatestProducts = async (req: Request, res: Response, next: NextFunction) => {
  const topLatestProducts = await Product.find({ deleted: false }).sort({ createdAt: -1 }).limit(10).lean();
  if (topLatestProducts.length < 1) throw new NotFoundError('Not Found Product');
  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: topLatestProducts, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
    );
};

// @Get Top Deals Of The Day
export const getTopDealsOfTheDay = async (req: Request, res: Response, next: NextFunction) => {
  const topDealsProducts = await Product.find({ deleted: false }).sort({ discountPercentage: 1 }).limit(2).lean();
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
      $match: { deleted: false },
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
    deleted: false,
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
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const thumbnailFile = files['thumbnail'];
  const imagesFiles = files['images'];
  const thumbnailURL = await uploadFiles(thumbnailFile);
  const imagesURLs = await uploadFiles(imagesFiles);

  req.body.thumbnail = thumbnailURL[0];
  req.body.images = imagesURLs;

  const product = await Product.create({ ...req.body });

  return res.status(StatusCodes.CREATED).json(
    customResponse({
      data: product,
      success: true,
      status: StatusCodes.CREATED,
      message: ReasonPhrases.CREATED,
    }),
  );
};

// @Patch: updateProduct
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, deleted: false },
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
  const product = await Product.findOneAndUpdate({ _id: req.params.id, deleted: false }, { deleted: true });
  if (!product) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} product with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: null, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
