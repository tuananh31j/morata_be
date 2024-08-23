import { AttributeType } from '@/constant/attributeType';
import Joi from 'joi';

const attributeSchema = {
    createAttibute: Joi.object({
        isRequired: Joi.boolean().default(false).messages({
            'boolean.base': 'Trường isRequired phải là kiểu boolean.',
        }),
        isVariant: Joi.boolean().default(false).messages({
            'boolean.base': 'Trường isVariant phải là kiểu boolean.',
        }),
        isFilter: Joi.boolean().default(false).messages({
            'boolean.base': 'Trường isFilter phải là kiểu boolean.',
        }),
        name: Joi.string().required().messages({
            'string.base': 'Trường name phải là kiểu chuỗi.',
            'any.required': 'Trường name là bắt buộc.',
        }),
        type: Joi.string()
            .valid(...Object.values(AttributeType))
            .required()
            .messages({
                'string.base': 'Trường type phải là kiểu chuỗi.',
                'any.only': `Trường type phải có giá trị là ${Object.values(AttributeType).join(', ')}.`,
                'any.required': 'Trường type là bắt buộc.',
            }),
        values: Joi.array().items(Joi.string()).messages({
            'array.base': 'Trường values phải là kiểu mảng.',
            'array.includes': 'Mảng values phải chứa các chuỗi.',
        }),
    }),
    updateAttibute: Joi.object({
        isRequired: Joi.boolean().messages({
            'boolean.base': 'Trường isRequired phải là kiểu boolean.',
        }),
        isVariant: Joi.boolean().messages({
            'boolean.base': 'Trường isVariant phải là kiểu boolean.',
        }),
        name: Joi.string().messages({
            'string.base': 'Trường name phải là kiểu chuỗi.',
        }),
        type: Joi.string()
            .valid(...Object.values(AttributeType))
            .messages({
                'string.base': 'Trường type phải là kiểu chuỗi.',
                'any.only': `Trường type phải có giá trị là ${Object.values(AttributeType).join(', ')}.`,
            }),
        values: Joi.array().items(Joi.string()).messages({
            'array.base': 'Trường values phải là kiểu mảng.',
            'array.includes': 'Mảng values phải chứa các chuỗi.',
        }),
    }),
};

export default attributeSchema;
