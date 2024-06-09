import config from '@/config/env.config';
import { UnAuthenticatedError, UnAuthorizedError } from '@/error/customError';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Custom payload interface for JWT
interface JwtPayload {
  userId: string;
  role: string;
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const cookies = req.cookies;
  if (!cookies.jwt) {
    return next(new UnAuthorizedError('Token: UnAuthorized access.'));
  }

  const authHeader = req.headers.authorization || (req.headers.Authorization as string);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnAuthenticatedError('Token: Invalidated access!'));
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, config.jwt.accessTokenKey, (err: any, decoded: any) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(new UnAuthenticatedError('Token has expired.'));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(new UnAuthenticatedError('Invalid token.'));
      }
      return next(new UnAuthenticatedError('Token verification failed.'));
    }

    const decodedToken = decoded as JwtPayload;
    req.userId = decodedToken.userId;
    req.role = decodedToken.role;

    return next();
  });
};
