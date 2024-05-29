import config from '@/config/env.config';
import { tokenTypes } from '@/constant/token';
import { NotAcceptableError } from '@/error/customError';
import Token from '@/models/Token';
import jwt from 'jsonwebtoken';

export const generateToken = (user: any, key: string, expires: string) => {
  const payload = { useId: user._id, role: user.role };
  const secreteKey = key;
  return jwt.sign(payload, secreteKey, { expiresIn: expires });
};

export const saveToken = async (token: string, userId: string, type: string) => {
  return await Token.create({ token, userId, type });
};

export const verifyToken = async (token: string, type: string) => {
  const decoded = jwt.verify(token, type);

  if (!decoded) {
    throw new NotAcceptableError('Unauthorized: Invalid Token.');
  }

  const foundedToken = await Token.findOne({ token: token, type: type });

  if (!foundedToken) {
    throw new NotAcceptableError('Unauthorized: Invalid Token.');
  }
  return foundedToken;
};

export const generateAuthTokens = async (user: any) => {
  const refreshToken = generateToken(user, config.jwt.refreshTokenKey, config.jwt.refreshExpiration);
  const accessToken = generateToken(user, config.jwt.accessTokenKey, config.jwt.accessExpiration);

  await saveToken(refreshToken, user._id, tokenTypes.REFRESH);

  return { accessToken, refreshToken };
};
