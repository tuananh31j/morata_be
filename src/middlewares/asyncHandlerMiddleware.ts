import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fn: any): ((req: Request, res: Response, next: NextFunction) => any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export default asyncHandler;
