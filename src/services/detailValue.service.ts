import { BadRequestError } from '@/error/customError';
import Detail from '@/models/Detail';
import DetailValue from '@/models/DetailValue';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createNewAttribute = async (req: Request, res: Response) => {
  const foundedDetail = await Detail.findById((req.body as any).detailId).lean();

  if (!foundedDetail) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} detail with id: ${(req.body as any).detailId}`);
  }

  const attribute = await DetailValue.create(req.body);

  return res.status(StatusCodes.CREATED).json({
    data: attribute,
    success: true,
    status: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
  });
};

export const updateDetailValue = async (req: Request, res: Response) => {
  const attribute = await DetailValue.findById(req.params.id).lean();

  if (!attribute) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} attribute with id: ${req.params.id}`);
  }

  const foundedDetail = await Detail.findById((req.body as any).detailId).lean();

  if (!foundedDetail) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} detail with id: ${(req.body as any).detailId}`);
  }

  const updatedAttribute = await DetailValue.findByIdAndUpdate(req.params.id, req.body, { new: true });

  return res.status(StatusCodes.OK).json({
    data: updatedAttribute,
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};

export const getAllDetailValueByDetailId = async (req: Request, res: Response) => {
  const attributes = await DetailValue.find({ detailId: req.params.detailId }).lean();

  return res.status(StatusCodes.OK).json({
    data: attributes,
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};
