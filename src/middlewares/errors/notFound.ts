import ErrorResponse from '@/interfaces/ErrorResponse';
import { Request, Response, NextFunction } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const notFound = (req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  res.status(StatusCodes.NOT_FOUND).json({
    data: null,
    message: ReasonPhrases.NOT_FOUND,
    status: StatusCodes.NOT_FOUND,
    success: false,
    error: true,
  });
};

export default notFound;
