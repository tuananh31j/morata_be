import { NotFoundError } from '@/error/customError';
import Category from '@/models/Category';
import Detail from '@/models/Detail';
import { Request, Response } from 'express';
import { ReasonPhrases } from 'http-status-codes';

export const getAllDetailsByCategory = async (req: Request, res: Response) => {
  const details = await Detail.find({ categoryId: req.params.categoryId }).lean();
  return details;
};

export const createNewDetail = async (req: Request, res: Response) => {
  const foundedCategory = await Category.findById(req.body.categoryId).lean();
  if (!foundedCategory) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} category with id: ${req.params.id}`);
  }

  const detail = await Detail.create(req.body);

  return detail;
};

export const getDetailById = async (req: Request, res: Response) => {
  const detail = await Detail.findById(req.params.id).lean();
  if (!detail) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} detail with id: ${req.params.id}`);
  }
  return detail;
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

  return updatedDetail;
};

export const addValueToDetail = async (req: Request, res: Response) => {
  const detail = await Detail.findById(req.body.id).lean();
  if (!detail) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} detail with id: ${req.params.id}`);
  }

  const newDetail = await Detail.findByIdAndUpdate(req.body.id, { $push: { values: req.body.value } }, { new: true });

  if (!newDetail) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} detail with id: ${req.body.id}`);
  }

  return newDetail;
};

export const removeValueFromDetail = async (req: Request, res: Response) => {
  const detail = await Detail.findById(req.body.id).lean();
  if (!detail) {
    throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} detail with id: ${req.params.id}`);
  }
  const newDetail = await Detail.findByIdAndUpdate(req.body.id, { $pull: { values: req.body.value } }, { new: true });
  return newDetail;
};
