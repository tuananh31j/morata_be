import Joi from 'joi';
import mongoose from 'mongoose';

// check if value is a valid ObjectId
const isObjectId = (value: any, helpers: Joi.CustomHelpers) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid', { value });
    }
    return value;
};

// Schema attributes
const attributeSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Tên thuộc tính không được để trống.',
    }),
    key: Joi.string().required().messages({
        'string.empty': 'Khóa thuộc tính không được để trống.',
    }),
});

// Schema variantAttributes
const variantAttributeSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Tên thuộc tính biến thể không được để trống.',
    }),
    key: Joi.string().required().messages({
        'string.empty': 'Khóa thuộc tính biến thể không được để trống.',
    }),
    value: Joi.string().required().messages({
        'string.empty': 'Giá trị thuộc tính biến thể không được để trống.',
    }),
});

// Schema variations
const variationSchema = Joi.object({
    imageUrlRef: Joi.string().required().messages({
        'string.empty': 'Đường dẫn hình ảnh không được để trống.',
    }),
    price: Joi.number().positive().min(1).required().messages({
        'number.base': 'Giá phải là một số hợp lệ.',
        'number.min': 'Giá không được nhỏ hơn {#limit}.',
    }),
    stock: Joi.number().required().positive().integer().min(1).messages({
        'number.base': 'Số lượng tồn kho phải là một số hợp lệ.',
        'number.integer': 'Số lượng tồn kho phải là một số nguyên.',
        'number.positive': 'Số lượng tồn kho phải là một số dương.',
    }),
    isActive: Joi.boolean().required().default(true).messages({
        'boolean.base': 'isActive phải là một giá trị boolean hợp lệ.',
    }),
    variantAttributes: Joi.array().items(variantAttributeSchema).required().messages({
        'array.base': 'variantAttributes phải là một mảng các đối tượng hợp lệ.',
    }),
});

// Main schema
const productSchema = {
    createProduct: Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Tên sản phẩm không được để trống.',
            'string.min': 'Tên sản phẩm phải có ít nhất {#limit} ký tự.',
            'string.max': 'Tên sản phẩm không được vượt quá {#limit} ký tự.',
        }),
        isHide: Joi.boolean().default(false).messages({
            'boolean.base': 'isHide phải là một giá trị boolean hợp lệ.',
        }),
        attributes: Joi.array().items(attributeSchema).required().messages({
            'array.base': 'Attributes phải là một mảng các đối tượng hợp lệ.',
        }),
        variationsString: Joi.array().items(variationSchema).required().messages({
            'array.base': 'variationsString phải là một mảng các đối tượng hợp lệ.',
        }),
        categoryId: Joi.string().required().custom(isObjectId).messages({
            'any.invalid': 'categoryId không hợp lệ.',
        }),
        brandId: Joi.string().required().custom(isObjectId).messages({
            'any.invalid': 'brandId không hợp lệ.',
        }),
        description: Joi.string().allow('').optional().default(''),
    }),
    updateProduct: Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Tên sản phẩm không được để trống.',
            'string.min': 'Tên sản phẩm phải có ít nhất {#limit} ký tự.',
        }),
        isHide: Joi.boolean().messages({
            'boolean.base': 'isHide phải là một giá trị boolean hợp lệ.',
        }),
        attributes: Joi.array().items(attributeSchema).required().messages({
            'array.base': 'Attributes phải là một mảng các đối tượng hợp lệ.',
        }),
        oldImages: Joi.array().items(Joi.string()).messages({
            'array.base': 'oldImages phải là một mảng các URL hợp lệ.',
        }),
        oldImageRefs: Joi.array().items(Joi.string()).messages({
            'array.base': 'oldImageRefs phải là một mảng các đường dẫn hợp lệ.',
        }),
        categoryId: Joi.string().required().custom(isObjectId).messages({
            'any.invalid': 'categoryId không hợp lệ.',
        }),
        brandId: Joi.string().required().custom(isObjectId).messages({
            'any.invalid': 'brandId không hợp lệ.',
        }),
        description: Joi.string().allow('').optional().default(''),
    }),
};
export default productSchema;
