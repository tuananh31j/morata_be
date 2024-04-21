import Joi from 'joi';

const categorySchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  description: Joi.string().min(3).max(50),
});

export default categorySchema;
