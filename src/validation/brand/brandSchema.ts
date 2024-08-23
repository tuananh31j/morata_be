import Joi from 'joi';

const brandSchema = {
    createBrand: Joi.object({
        name: Joi.string().min(1).max(50).required().messages({
            'string.base': 'Tên thương hiệu phải là một chuỗi ký tự.',
            'string.empty': 'Tên thương hiệu không được để trống.',
            'string.min': 'Tên thương hiệu phải có ít nhất {#limit} ký tự.',
            'string.max': 'Tên thương hiệu không được vượt quá {#limit} ký tự.',
            'any.required': 'Tên thương hiệu là bắt buộc.',
        }),
    }),
    updateBrand: Joi.object({
        name: Joi.string().min(3).max(50).messages({
            'string.base': 'Tên thương hiệu phải là một chuỗi ký tự.',
            'string.empty': 'Tên thương hiệu không được để trống.',
            'string.min': 'Tên thương hiệu phải có ít nhất {#limit} ký tự.',
            'string.max': 'Tên thương hiệu không được vượt quá {#limit} ký tự.',
        }),
    }),
};

export default brandSchema;
