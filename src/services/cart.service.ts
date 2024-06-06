import { BadRequestError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

// @Get cart by user
export const getCartByUser = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ userId: req.params.id })
    .populate('items.productId', 'name price thumbnail discountPercentage')
    .lean();
  if (!cart) {
    throw new NotFoundError('Not found cart or cart is not exist.');
  }

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Add to cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  const product = await Product.findById(req.body.productId);
  if (!product) {
    throw new BadRequestError(`Not found product with id ${req.body.productId}`);
  }
  if (req.body.quantity < 1) {
    throw new BadRequestError(`Quantity must be at least 1`);
  }

  // Find the cart for the user or create a new one
  let cart = await Cart.findOne({ userId: req.body.userId });
  if (!cart) {
    cart = new Cart({ userId: req.body.userId, items: [] });
  }

  // Check if the product already exists in the cart
  const existingItemIndex = cart.items.findIndex((item) => item.productId.equals(req.body.productId));
  if (existingItemIndex !== -1) {
    // Update the quantity if the product is already in the cart
    cart.items[existingItemIndex].quantity += req.body.quantity;
  } else {
    // Add the new product to the cart
    cart.items.push({ productId: req.body.productId, quantity: req.body.quantity });
  }

  // Save the cart
  await cart.save();

  const cartData = _.pick(cart, ['userId', 'items']);

  return res
    .status(StatusCodes.OK)
    .json(
      customResponse({ data: cartData, success: true, status: StatusCodes.CREATED, message: ReasonPhrases.CREATED }),
    );
};

// @Remove one cart item
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
  const cart: any = await Cart.findOne({ userId: req.body.userId });
  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }
  const cartItems = cart.items.filter((item: any) => item.productId._id.toString() !== req.body.productId);
  cart.items = [...cartItems];
  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Remove all cart items
export const removeAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
  const cart: any = await Cart.findOne({ userId: req.body.userId });

  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  cart.items = [];
  await cart.save();

  return res
    .status(StatusCodes.NO_CONTENT)
    .json(
      customResponse({ data: null, success: true, status: StatusCodes.NO_CONTENT, message: ReasonPhrases.NO_CONTENT }),
    );
};

// @Increase  cart item quantity
export const increaseCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ userId: req.body.userId });

  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  const cartItem = cart.items.find((item) => item.productId.toString() === req.body.productId);
  if (!cartItem) {
    throw new BadRequestError(`Not found product with Id: ${req.body.productId} inside this cart`);
  }

  cartItem.quantity++;

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Decrease cart item quantity
export const decreaseCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
  const cart = await Cart.findOne({ userId: req.body.userId });

  if (!cart) {
    throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
  }

  const cartItem = cart.items.find((item) => item.productId.toString() === req.body.productId);
  if (!cartItem) {
    throw new BadRequestError(`Not found product with Id: ${req.body.productId}`);
  }

  if (cartItem.quantity > 1) {
    cartItem.quantity--;
  }

  await cart.save();

  return res
    .status(StatusCodes.OK)
    .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};
