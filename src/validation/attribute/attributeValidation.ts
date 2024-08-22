import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';
import { BadRequestError } from '@/error/customError';
import attributeSchema from './attributeSchema';
import Attribute from '@/models/Attribute';
import { convertString } from '@/utils/convertString';

export const createAttributeValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, type } = req.body;
    const isRequired = req.body.isRequired || false;
    const isVariant = req.body.isVariant || false;
    const values = req.body.values || [];
    const checkUniqueName = await Attribute.findOne({ name }).select('_id').lean();

    if (checkUniqueName) next(new BadRequestError('Tên thuộc tính đã tồn tại!'));

    let attributeKey = convertString(name);
    const checkUniqueKey = await Attribute.findOne({ attributeKey }).select('_id').lean();
    if (checkUniqueKey) {
        attributeKey = `${attributeKey}_${Date.now()}`;
    }

    req.body = { name, attributeKey, isRequired, isVariant, type, values };
    return validator(attributeSchema.createAttibute, { ...req.body }, next);
};

export const updateAttributeValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const attributeId = req.params.attributeId;
    const { name, type } = req.body;
    const isRequired = req.body.isRequired || false;
    const isVariant = req.body.isVariant || false;
    const values = req.body.values || [];
    const checkUniqueName = await Attribute.findOne({ name }).select('_id').lean();
    const isThisAttribute = !checkUniqueName || attributeId === String(checkUniqueName?._id);

    if (!isThisAttribute) next(new BadRequestError('Tên thuộc tính đã tồn tại!'));

    let attributeKey = convertString(name);
    const checkUniqueKey = await Attribute.findOne({ attributeKey }).select('_id').lean();

    if (checkUniqueKey) attributeKey = `${attributeKey}_${Date.now()}`;

    req.body = { name, attributeKey, isRequired, isVariant, type, values };
    return validator(attributeSchema.updateAttibute, { ...req.body }, next);
};
