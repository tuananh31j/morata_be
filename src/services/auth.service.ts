import { BadRequestError, DuplicateError, UnauthorizedError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import bcrypt from 'bcryptjs';
import { generateAuthTokens, verifyToken } from './token.service';
import { tokenTypes } from '@/constant/token';
import config from '@/config/env.config';
import Token from '@/models/Token';

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

  const decoded = await verifyToken(cookie.jwt, tokenTypes.REFRESH, config.jwt.refreshTokenKey);

  const foundedUser = await User.findById(decoded.user);
  if (!foundedUser) {
    throw new UnauthorizedError('Token: No permission to access.');
  }

  await Token.findOneAndDelete({ user: decoded.user });
  const { access, refresh } = await generateAuthTokens(foundedUser);

  return { access, refresh };
};
