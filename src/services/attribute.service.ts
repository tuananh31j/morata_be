import { AttributeType } from '@/constant/attributeType';
import { NotFoundError } from '@/error/customError';
import APIQuery from '@/helpers/apiQuery';
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
// @Get: get details of attribute
export const getAttributeDetails = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.attributeId;
    const attribute = await Attribute.findById(id);
    if (!attribute) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} attribute with id: ${id}`);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: attribute,
            success: true,
            status: StatusCodes.OK,
            message: ReasonPhrases.OK,
        }),
    );
};

// @Get: get all attributes
export const getAllAttributes = async (req: Request, res: Response, next: NextFunction) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const page = req.query.page ? +req.query.page : 1;
    req.query.limit = String(req.query.limit || 10);
    const features = new APIQuery(
        Attribute.find({}).select({
            name: 1,
            attributeKey: 1,
            isVariant: 1,
            values: 1,
            type: 1,
            isRequired: 1,
        }),
        req.query,
    );
    features.paginate().sort().filter().search();

    const [data, totalDocs] = await Promise.all([features.query, features.count()]);
    const totalPages = Math.ceil(Number(totalDocs) / +req.query.limit);

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: {
                attributes: data,
                page: page,
                totalDocs: totalDocs,
                totalPages: totalPages,
            },
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

// @Get: create attibute
export const updateAttibute = async (req: Request, res: Response, next: NextFunction) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const id = req.params.attributeId;
    const newAttributes = await Attribute.findOneAndUpdate({ _id: id }, req.body, { new: true });
    if (!newAttributes) throw new NotFoundError(`${ReasonPhrases.NOT_FOUND} attribute with id: ${id}`);
    return res.status(StatusCodes.OK).json(
        customResponse({
            data: newAttributes,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};
