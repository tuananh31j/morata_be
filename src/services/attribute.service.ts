import { BadRequestError } from '@/error/customError';
import customResponse from '@/helpers/response';
import { Attribute, ValueAttribute } from '@/models/Attribute';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// ================================ Value Attribute ===============================

// create new value for attribute
export const createNewValueAttribute = async (req: Request, res: Response, next: NextFunction) => {
  const attribute = await Attribute.findById(req.params.id);

  if (!attribute) {
    throw new BadRequestError(`Not found attribute with id: ${req.params.id}`);
  }

  const valueAttribute = await ValueAttribute.create({ ...req.body });

  attribute.values.push(valueAttribute._id);
  const attributeData = await attribute.save();

  return res.status(StatusCodes.CREATED).json(
    customResponse({
      data: attributeData,
      success: true,
      status: StatusCodes.CREATED,
      message: ReasonPhrases.CREATED,
    }),
  );
};

// @Get all values
export const getAllValueAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const valueAttributes = await ValueAttribute.find().lean();
  return res.status(StatusCodes.OK).json(
    customResponse({
      data: valueAttributes,
      success: true,
      status: StatusCodes.OK,
      message: ReasonPhrases.OK,
    }),
  );
};

// ============================ Attribute ===========================================

// @Create new value
export const createNewAttribute = async (req: Request, res: Response, next: NextFunction) => {
  const existingAttribute = await Attribute.findOne({ name: req.body.name, category: req.body.categoryId });

  if (existingAttribute) {
    throw new BadRequestError('Duplicate attribute.');
  }

  const newAttribute = await Attribute.create({ name: req.body.name });

  return res.status(StatusCodes.CREATED).json(
    customResponse({
      data: newAttribute,
      success: true,
      status: StatusCodes.CREATED,
      message: ReasonPhrases.CREATED,
    }),
  );
};

// @Get all attributes
export const getAllAttributes = async (req: Request, res: Response, next: NextFunction) => {
  const attributes = await Attribute.find().populate('values').lean();
  return res.status(StatusCodes.OK).json(
    customResponse({
      data: attributes,
      success: true,
      status: StatusCodes.OK,
      message: ReasonPhrases.OK,
    }),
  );
};
