import { Response, Request, NextFunction } from 'express';
import Attribute from '@/models/Attribute';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import customResponse from '@/helpers/response';
import Category from '@/models/Category';
import { BadRequestError, DuplicateError } from '@/error/customError';

export const createAttribute = async (req: Request, res: Response, next: NextFunction) => {
  const foundedCategory = await Category.findById(req.body.categoryId);
  if (!foundedCategory) {
    throw new BadRequestError(`Invalid categoryId with id ${req.body.categoryId}`);
  }

  const foundedAttribute = await Attribute.findOne({ attribute: req.body.attribute, categoryId: req.body.categoryId });

  if (foundedAttribute) {
    throw new DuplicateError(`Duplicate attribute.`);
  }
  const attribute = await Attribute.create({ ...req.body });

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: attribute, message: ReasonPhrases.CREATED, status: StatusCodes.CREATED, success: true }),
    );
};

export const getAllAttributesByCategory = async (req: Request, res: Response, next: NextFunction) => {
  const foundedCategory = await Category.findById(req.params.categoryId);
  if (!foundedCategory) {
    throw new BadRequestError(`Invalid categoryId with id ${req.params.categoryId}`);
  }

  const attributes = await Attribute.find({ categoryId: req.params.categoryId }).populate('');

  return res
    .status(StatusCodes.CREATED)
    .json(customResponse({ data: attributes, message: ReasonPhrases.OK, status: StatusCodes.OK, success: true }));
};

// ===================  Attribute Value =====================

export const addValueToAttribute = async (req: Request, res: Response, next: NextFunction) => {
  const { name, value } = req.body;

  const foundedAttribute = await Attribute.findById(req.params.id);

  if (!foundedAttribute) {
    throw new BadRequestError(`Not found attribute.`);
  }

  foundedAttribute.details.map((attribute: { name: string; value: any }) => {
    if (name === attribute.name) {
      throw new DuplicateError(`Attribute Value existed.`);
    }
  });

  foundedAttribute.details.push({ name, value });

  const result = await foundedAttribute.save();

  return res
    .status(StatusCodes.CREATED)
    .json(customResponse({ data: result, message: ReasonPhrases.CREATED, status: StatusCodes.CREATED, success: true }));
};
