import { NotFoundError } from '@/error/customError';
import Category from '@/models/Category';
import Detail from '@/models/Detail';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getAllDetailsByCategory = async (req: Request, res: Response) => {
  const details = await Detail.find({ categoryId: req.params.categoryId }).lean();

  return res.status(StatusCodes.OK).json({
    data: details,
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};

export const createNewDetail = async (req: Request, res: Response) => {
  const foundedCategory = await Category.findById(req.body.categoryId).lean();
  if (!foundedCategory) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }

  const detail = await Detail.create(req.body);

  return res.status(StatusCodes.CREATED).json({
    data: detail,
    success: true,
    status: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
  });
};

export const updateDetail = async (req: Request, res: Response) => {
  const detail = await Detail.findById(req.params.id).lean();
  if (!detail) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} detail with id: ${req.params.id}`);
  }

  const foundedCategory = await Category.findById(req.body.categoryId).lean();
  if (!foundedCategory) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }

  const updatedDetail = await Detail.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!updatedDetail) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} detail with id: ${req.params.id}`);
  }

  return res.status(StatusCodes.OK).json({
    data: updatedDetail,
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};
