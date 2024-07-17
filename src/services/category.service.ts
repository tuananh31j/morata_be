import { NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Attribute from '@/models/Attribute';
import Category from '@/models/Category';
import Product from '@/models/Product';
import { getListAllFilesStorage } from '@/utils/files';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: getAllCategories
export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.find({}).lean();
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: categories, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get 10 popular categories
export const getPopularCategories = async (req: Request, res: Response, next: NextFunction) => {
  const pipeline = [
    {
      $group: {
        _id: '$categoryId',
        totalProducts: { $sum: 1 },
      },
    },
    {
      $sort: { totalProducts: -1 },
    },
    {
      $limit: 6,
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    {
      $unwind: '$categoryDetails',
    },
    {
      $project: {
        _id: 0,
        categoryId: '$_id',
        categoryName: '$categoryDetails.name',
        totalProducts: 1,
      },
    },
  ];

  const folderResource = 'categories/';
  const popularCategories = await Product.aggregate(pipeline as any[]);
  const images = await getListAllFilesStorage(folderResource);

  for (let i = 0; i < popularCategories.length; i++) {
    if (images && popularCategories) {
      popularCategories[i]['image'] = images[0];
    }
  }

  return res.status(StatusCodes.OK).json(
    customResponse({
      data: popularCategories,
      success: true,
      status: StatusCodes.OK,
      message: ReasonPhrases.OK,
    }),
  );
};

// @Get: getDetailedCategory
export const getDetailedCategory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findOne({ _id: req.params.id, deleted: false }).lean();
  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }
  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: category, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Post: createNewCategory
export const createNewCategory = async (req: Request, res: Response, next: NextFunction) => {
  const attributeIds = req.body.attributeIds as string[];
  const name = req.body.name as string;

  if (req.body.newAttributes) {
    const newAttributes = req.body.newAttributes as { name: string; values: string[] | number[] }[];
    const data = await Attribute.insertMany(newAttributes);
    attributeIds.push(...data.map((item) => item._id as unknown as string));
  }
  const category = await Category.create({ name, attributeIds });

  console.log(req.body);

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: category, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};

// @Patch: updateCategory
export const updateCateGory = async (req: Request, res: Response, next: NextFunction) => {
  const category = await Category.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
  if (!category) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: category, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
