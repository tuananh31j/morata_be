import customResponse from '@/helpers/response';
import Attribute from '@/models/Attribute';
import Category from '@/models/Category';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get: get all attibutes by category
export const getAttributesByCategory = async (req: Request, res: Response, next: NextFunction) => {
    const attributes = await Category.findById(req.params.categoryId, { attributeIds: 1 })
        .populate('attributeIds')
        .lean();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: attributes, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Get: create attibute
export const createAttibute = async (req: Request, res: Response, next: NextFunction) => {
    const newAttributes = await Attribute.create(req.body);
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
            values: 1,
            type: 1,
        },
        { attributeIds: 0 },
    ).lean();

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: attributes, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
