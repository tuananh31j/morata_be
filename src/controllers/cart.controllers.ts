import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { cartService } from '../services/index';

// @Get: getCartByUser
export const getCartByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await cartService.getCartByUser(req, res, next);
});

// @Post: addToCart
export const addToCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await cartService.addToCart(req, res, next);
});

// @Patch: increaseCartItemQuantity
export const increaseCartItemQuantity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await cartService.increaseCartItemQuantity(req, res, next);
});

// @Patch: decreaseCartItemQuantity
export const decreaseCartItemQuantity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await cartService.decreaseCartItemQuantity(req, res, next);
});

// @Patch: removeCartItem
export const removeCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await cartService.removeCartItem(req, res, next);
});

// @Patch: removeAllCartItems
export const removeAllCartItems = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return await cartService.removeAllCartItems(req, res, next);
});
