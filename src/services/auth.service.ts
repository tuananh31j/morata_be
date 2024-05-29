import { tokenTypes } from '@/constant/token';
import { BadRequestError, DuplicateError, NotAcceptableError, UnauthorizedError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { generateAuthTokens, verifyToken } from './token.service';

// @Register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  const foundedUser = await User.findOne({ email: req.body.email });
  if (foundedUser) {
    throw new DuplicateError('This email is taken.');
  }

  const newUser = await User.create({ ...req.body });

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: newUser, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};

// @Login

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const foundedUser = await User.findOne({ email: req.body.email });

  if (!foundedUser) {
    throw new BadRequestError('Incorrect email or password');
  }

  const isMatchedPassword = await bcrypt.compare(req.body.password, foundedUser?.password);

  if (!isMatchedPassword) {
    throw new BadRequestError('Incorrect email or password');
  }

  return foundedUser;
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies;

  if (!cookie.jwt) {
    throw new UnauthorizedError('Token: No permission to access.');
  }
  const token = await verifyToken(cookie.jwt, tokenTypes.REFRESH);

  const user = await User.findById(token.userId);
  if (!user) {
    throw new NotAcceptableError('Unauthorized: Invalid refresh token');
  }

  return await generateAuthTokens(user);
};
