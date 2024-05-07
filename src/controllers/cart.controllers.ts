import { Request, Response, NextFunction } from 'express';
import asyncHandler from '@/middlewares/asyncHandlerMiddleware';
import { cartService } from '../services/index';

// @Get: getCartByUser
export const getCartByUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  return cartService.getCartByUser(req, res, next);
});

// @Post: addToCart
export const addToCart = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return cartService.addToCart(req, res, next);
});

// @Patch: increaseCartItemQuantity
export const increaseCartItemQuantity = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return cartService.increaseCartItemQuantity(req, res, next);
});

// @Patch: decreaseCartItemQuantity
export const decreaseCartItemQuantity = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return cartService.decreaseCartItemQuantity(req, res, next);
});

// @Patch: removeCartItem
export const removeCartItem = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return cartService.removeCartItem(req, res, next);
});

// @Patch: removeAllCartItems
export const removeAllCartItems = asyncHandler((req: Request, res: Response, next: NextFunction) => {
  return cartService.removeAllCartItems(req, res, next);
});
