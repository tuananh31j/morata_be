import Joi from 'joi';

const categorySchema = {
    createCate: Joi.object({
        name: Joi.string().min(3).max(30).required().messages({
            'string.base': 'Tên phải là một chuỗi ký tự.',
            'string.empty': 'Tên không được để trống.',
            'string.min': 'Tên phải có ít nhất {#limit} ký tự.',
            'string.max': 'Tên không được vượt quá {#limit} ký tự.',
        }),
        attributeIds: Joi.array().items(Joi.string()).min(1).required().messages({
            'array.base': 'Thuộc tính phải là một mảng.',
            'array.min': 'Phải có ít nhất {#limit} thuộc tính cho một danh mục.',
            'any.required': 'Thuộc tính là bắt buộc.',
            'string.base': 'Mỗi thuộc tính phải là một chuỗi ký tự.',
        }),
    }),
    updateCate: Joi.object({
        name: Joi.string().min(3).max(30).messages({
            'string.base': 'Tên phải là một chuỗi ký tự.',
            'string.min': 'Tên phải có ít nhất {#limit} ký tự.',
            'string.max': 'Tên không được vượt quá {#limit} ký tự.',
        }),
        attributeIds: Joi.array().items(Joi.string()).min(1).messages({
            'array.base': 'Thuộc tính phải là một mảng.',
            'array.min': 'Phải có ít nhất {#limit} thuộc tính cho một danh mục.',
            'string.base': 'Mỗi thuộc tính phải là một chuỗi ký tự.',
        }),
    }),
};

export default categorySchema;
