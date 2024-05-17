import { BadRequestError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { CartData } from '@/types/cart';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get cart by user
export const getCartByUser = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.params.userId }).populate('items.productId').lean();
  const cartData: CartData = {
    userId: req.params.userId,
    items: cart
      ? cart!.items.map((item: any) => {
          return {
            productId: item.productId._id,
            name: item.productId.name,
            price: item.productId.price,
            quantity: item.productId.quantity,
            thumbnail: item.productId.thumbnail,
          };
        })
      : [],
  };

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cartData, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Add to cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  let cart = await Cart.findOne({ user: req.body.userId });
  if (!cart) {
    cart = new Cart({ user: req.body.userId, items: [] });
  }

  const product = await Product.findById(req.body.productId);
  if (!product) {
    throw new BadRequestError(`Not found product with Id: ${req.body.productId}`);
  }

  const existingItem = cart.items.find((item) => item.productId.equals(req.body.productId));

  if (existingItem) {
    existingItem.quantity += req.body.quantity;
  } else {
    const newItem = {
      productId: req.body.productId,
      quantity: req.body.quantity,
    };
    cart.items.push(newItem);
  }
  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }));
};

// @Remove one cart item
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.body.userId });
  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  cart.items.filter((item) => item.productId._id !== req.body.productId);
  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Remove all cart items
export const removeAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
  const cart: any = await Cart.findOne({ user: req.body.userId }).lean();
  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  cart.items = [];

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Increase  cart item quantity
export const increaseCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.body.userId });

  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  const cartItem = cart.items.find((item) => item.productId.toString() === req.body.productId);
  if (!cartItem) {
    throw new BadRequestError(`Not found product with Id: ${req.body.productId}`);
  }

  cartItem.quantity++;

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Decrease cart item quantity
export const decreaseCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ user: req.body.userId });

  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  const cartItem = cart.items.find((item) => item.productId.toString() === req.body.productId);
  if (!cartItem) {
    throw new BadRequestError(`Not found product with Id: ${req.body.productId}`);
  }

  cartItem.quantity--;

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
