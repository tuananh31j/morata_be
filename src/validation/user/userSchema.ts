import { ROLE } from '@/constant/allowedRoles';
import Joi from 'joi';

const brandSchema = {
    createUser: Joi.object({
        username: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phone: Joi.string().min(9).max(11).required(),
        role: Joi.string().valid(ROLE.USER, ROLE.ADMIN).default(ROLE.USER),
    }),
    updateUser: Joi.object({
        username: Joi.string().min(3).max(50),
        email: Joi.string().email(),
        password: Joi.string(),
        phone: Joi.string().min(9).max(11),
        role: Joi.string().valid(ROLE.USER, ROLE.ADMIN).default(ROLE.USER),
    }),
};

export default brandSchema;
