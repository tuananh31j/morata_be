import { BadRequestError } from '@/error/customError';
import Attribute from '@/models/Attribute';
import AttributeValue from '@/models/AttributeValue';
import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getAllAttributeValuesByAttribute = async (req: Request, res: Response) => {
  const attributeValues = await AttributeValue.find({ attributeId: req.params.attributeId }).lean();

  return res.status(StatusCodes.OK).json({
    data: attributeValues,
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};

export const createNewAttributeValue = async (req: Request, res: Response) => {
  const foundedAttribute = await Attribute.findById((req.body as any).attributeId).lean();

  if (!foundedAttribute) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} attribute with id: ${(req.body as any).attributeId}`);
  }

  const attributeValue = await AttributeValue.create(req.body);

  return res.status(StatusCodes.CREATED).json({
    data: attributeValue,
    success: true,
    status: StatusCodes.CREATED,
    message: ReasonPhrases.CREATED,
  });
};

export const updateAttributeValue = async (req: Request, res: Response) => {
  const attributeValue = await AttributeValue.findById(req.params.id).lean();

  if (!attributeValue) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} attributeValue with id: ${req.params.id}`);
  }

  const foundedAttribute = await Attribute.findById((req.body as any).attributeId).lean();

  if (!foundedAttribute) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} attribute with id: ${(req.body as any).attributeId}`);
  }

  const updatedAttributeValue = await AttributeValue.findByIdAndUpdate(req.params.id, req.body, { new: true });

  return res.status(StatusCodes.OK).json({
    data: updatedAttributeValue,
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};

export const deleteAttributeValue = async (req: Request, res: Response) => {
  const attributeValue = await AttributeValue.findById(req.params.id).lean();

  if (!attributeValue) {
    throw new BadRequestError(`${ReasonPhrases.BAD_REQUEST} attributeValue with id: ${req.params.id}`);
  }

  await AttributeValue.findByIdAndDelete(req.params.id);

  return res.status(StatusCodes.OK).json({
    success: true,
    status: StatusCodes.OK,
    message: ReasonPhrases.OK,
  });
};
