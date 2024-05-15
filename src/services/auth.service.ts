import { DuplicateError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const foundUser = await User.findOne({ email: req.body.email });
  if (foundUser) {
    throw new DuplicateError('This email is taken.');
  }

  const newUser = await User.create({ ...req.body });

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: newUser, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};
