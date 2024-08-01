import { AttributeType } from '@/constant/attributeType';
import customResponse from '@/helpers/response';
import Attribute from '@/models/Attribute';
import Category from '@/models/Category';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const populateAttributesVariant = {
    path: 'attributeIds',
    model: 'Attribute',
    match: { isVariant: true },
};
const populateAttributesProduct = {
    path: 'attributeIds',
    model: 'Attribute',
    match: { isVariant: false },
};

// @Get: get all attibutes by category
export const getAttributesByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    const [productAttributes, variantAttribute] = await Promise.all([
        Category.findById(categoryId, { attributeIds: 1, _id: 0 }).populate(populateAttributesProduct).lean(),
        Category.findById(categoryId, { attributeIds: 1, _id: 0 }).populate(populateAttributesVariant).lean(),
    ]);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: { categoryId, productAttributes, variantAttribute },
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get: create attibute
export const createAttibute = async (req: Request, res: Response, next: NextFunction) => {
    const newAttributes = new Attribute(req.body);
    await newAttributes.save();
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newAttributes,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

// @Get: get all attributes
export const getAllAttributes = async (req: Request, res: Response, next: NextFunction) => {
    const attributes = await Attribute.find(
        {},
        {
            name: 1,
            attributeKey: 1,
            isRequired: 1,
            isVariant: 1,
            values: 1,
            type: 1,
        },
        { attributeIds: 0 },
    ).lean();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: attributes, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
