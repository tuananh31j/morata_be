import Joi from 'joi';
import mongoose from 'mongoose';

const productSchema = Joi.object({
  name: Joi.string().required().trim(),
  description: Joi.string().trim(),
  price: Joi.number().required().min(0),
  discountPercentage: Joi.number().min(0).default(0),
  stock: Joi.number().min(0).default(0),
  images: Joi.array().items(Joi.string()),
  thumbnail: Joi.string(),
  category: Joi.string()
    .required()
    .custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.error('Invalid category ID');
      }
      return value;
    }),
  brand: Joi.string()
    .required()
    .custom((value, helper) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helper.error('Invalid brand ID');
      }
      return value;
    }),
  attributes: Joi.any(),
});

export default productSchema;
