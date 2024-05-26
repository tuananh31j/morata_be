import customResponse from '@/helpers/response';
import Review from '@/models/Review';
import Product from '@/models/Product';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createNewReview = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.body.productId);
  const newReview = new Review({ ...req.body });
  product?.reviewIds.push(newReview._id as any);
  await product?.save();
  await newReview.save();

  return res
    .status(StatusCodes.CREATED)
    .json(
      customResponse({ data: newReview, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};
