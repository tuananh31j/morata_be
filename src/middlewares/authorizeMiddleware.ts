import { allowedRoles } from '@/constant/allowedRoles';
import { UnAuthorizedError } from '@/error/customError';
import { NextFunction, Request } from 'express';

export const permissionAllow = (req: Request, res: Response, next: NextFunction) => {
  return req.role && allowedRoles.includes(req.role) ? next() : next(new UnAuthorizedError('No permission to access!'));
};
