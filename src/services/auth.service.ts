import config from '@/config/env.config';
import { tokenTypes } from '@/constant/token';
import { BadRequestError, DuplicateError, NotAcceptableError } from '@/error/customError';
import customResponse from '@/helpers/response';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { generateToken, verifyToken } from './token.service';
import _ from 'lodash';

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

  const user = _.pick(foundedUser, ['_id', 'username', 'email', 'role']);
  return user;
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies;

  if (!cookie.jwt) {
    throw new NotAcceptableError('Not Acceptable: Invalid token refresh.');
  }
  const token = await verifyToken(cookie.jwt, config.jwt.refreshTokenKey, tokenTypes.REFRESH);

  const user = await User.findById(token.userId);
  if (!user) {
    throw new NotAcceptableError('Not Acceptable: Invalid token refresh.');
  }

  const accessToken = generateToken(user, config.jwt.accessTokenKey, config.jwt.accessExpiration);

  return { accessToken };
};

// @Logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies;
  if (!cookie.jwt) {
    throw new NotAcceptableError('Not Acceptable: Invalid Token');
  }
  const token = await verifyToken(cookie.jwt, config.jwt.refreshTokenKey, tokenTypes.REFRESH);
  await token.deleteOne();

  res.clearCookie('jwt', { maxAge: 0, sameSite: 'none', httpOnly: true, secure: true });

  return res
    .status(StatusCodes.RESET_CONTENT)
    .json(customResponse({ data: null, message: 'logged out', success: true, status: StatusCodes.NO_CONTENT }));
};
