import Joi from 'joi';

const brandSchema = {
    createBrand: Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string(),
        country: Joi.string(),
    }),
    updateBrand: Joi.object({
        name: Joi.string().min(3).max(50),
        description: Joi.string(),
        country: Joi.string(),
    }),
};

export default brandSchema;
