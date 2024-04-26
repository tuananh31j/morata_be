import Joi from 'joi';

const brandSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string(),
  country: Joi.string(),
});

export default brandSchema;
