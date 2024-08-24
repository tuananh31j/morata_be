import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';
import { BadRequestError } from '@/error/customError';
import attributeSchema from './attributeSchema';
import Attribute from '@/models/Attribute';
import { convertString } from '@/utils/convertString';
import { AttributeType } from '@/constant/attributeType';

export const createAttributeValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { name, type } = req.body;
    const isRequired = req.body.isRequired || false;
    const isVariant = req.body.isVariant || false;
    const isFilter = req.body.isFilter || false;
    const values = req.body.values || [];
    const checkUniqueName = await Attribute.findOne({ name }).select('_id').lean();
    if (isFilter && type !== AttributeType.Options)
        next(new BadRequestError('Nếu thuộc tính này áp dụng cho bộ lọc thì thuộc tính này phải thuộc kiểu lựa chọn!'));

    if (checkUniqueName) next(new BadRequestError('Tên thuộc tính đã tồn tại!'));

    let attributeKey = convertString(name);
    const checkUniqueKey = await Attribute.findOne({ attributeKey }).select('_id').lean();
    if (checkUniqueKey) {
        attributeKey = `${attributeKey}_${Date.now()}`;
    }

    req.body = { name, attributeKey, isRequired, isVariant, type, values, isFilter };
    return validator(attributeSchema.createAttibute, { ...req.body }, next);
};

export const updateAttributeValidation: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const attributeId = req.params.attributeId;
    const { name, type } = req.body;
    const isRequired = req.body.isRequired || false;
    let isVariant = req.body.isVariant || false;
    const isFilter = req.body.isFilter || false;

    const values = req.body.values || [];
    if (type === AttributeType.Multiple) isVariant = false;

    const checkUniqueName = await Attribute.findOne({ name }).select('_id').lean();
    const isThisAttribute = !checkUniqueName || attributeId === String(checkUniqueName?._id);

    if (isFilter && type !== AttributeType.Options)
        next(new BadRequestError('Nếu thuộc tính này áp dụng cho bộ lọc thì thuộc tính này phải thuộc kiểu lựa chọn!'));

    if (!isThisAttribute) next(new BadRequestError('Tên thuộc tính đã tồn tại!'));

    let attributeKey = convertString(name);
    const checkUniqueKey = await Attribute.findOne({ attributeKey }).select('_id').lean();

    if (checkUniqueKey) attributeKey = `${attributeKey}_${Date.now()}`;

    req.body = { name, attributeKey, isRequired, isVariant, type, values, isFilter };
    return validator(attributeSchema.updateAttibute, { ...req.body }, next);
};
