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

// @Patch: updateCartItemQuantity
export const updateCartItemQuantity = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.updateCartItemQuantity(req, res, next);
});

// @Patch: removeCartItem
export const removeCartItem = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.removeCartItem(req, res, next);
});

// @Patch: removeAllCartItems
export const removeAllCartItems = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await cartService.removeAllCartItems(req, res, next);
});
