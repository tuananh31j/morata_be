import { RequestHandler, Request, Response, NextFunction } from 'express';
import validator from '../validator';
import { userSchema } from '.';
import _ from 'lodash';

export const createUserValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    return validator(userSchema.createUser, { ...req.body }, next);
};

export const updateUserValidation: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    req.body = _.pick(req.body, ['name', 'email', 'password', 'role']);
    return validator(userSchema.updateUser, { ...req.body }, next);
};
