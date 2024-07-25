import { BadRequestError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import ProductVariation from '@/models/ProductVariation';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import _ from 'lodash';

// @Get cart by user
export const getCartByUser = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOne({ userId: req.params.id }).populate({
        path: 'items.productId',
        populate: {
            path: 'productId',
            select: { name: 1 },
        },
    });
    if (!cart) {
        throw new NotFoundError('Not found cart or cart is not exist.');
    }

    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: cart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Add to cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    let updatedCart = null;
    const product = await ProductVariation.findById(req.body.productId).select({ stock: 1 }).lean();
    const currentCart = await Cart.findOne({ userId: req.body.userId })
        .select({ items: 1 })
        .lean<{ items: { productId: string; quantity: number }[] }>();

    if (!product) {
        throw new BadRequestError(`Not found product with id ${req.body.productId}`);
    }

    if (req.body.quantity < 1) {
        throw new BadRequestError(`Quantity must be at least 1`);
    }
    if (req.body.quantity > product.stock!) {
        req.body.quantity = product.stock;
    }

    if (currentCart && currentCart.items.length > 0) {
        const currentQuantity = currentCart.items.find((item) => item.productId == req.body.productId)?.quantity || 0;
        const newQuantity = currentQuantity + req.body.quantity;
        updatedCart = await Cart.findOneAndUpdate(
            { userId: req.body.userId, 'items.productId': req.body.productId },
            { $set: { 'items.$.quantity': newQuantity > product.stock! ? product.stock! : newQuantity } },
            { new: true, upsert: false },
        );
    }

    if (!updatedCart) {
        updatedCart = await Cart.findOneAndUpdate(
            { userId: req.body.userId },
            { $push: { items: { productId: req.body.productId, quantity: req.body.quantity } } },
            { new: true, upsert: true },
        );
    }

    return res.status(StatusCodes.OK).json(
        customResponse({
            data: updatedCart,
            success: true,
            status: StatusCodes.CREATED,
            message: ReasonPhrases.CREATED,
        }),
    );
};

// @Remove one cart item
export const removeCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const updatedCart = await Cart.findOneAndUpdate(
        { userId: req.body.userId },
        { $pull: { items: { productId: req.body.productId } } },
        { new: true },
    );
    if (!updatedCart) {
        throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
    }
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: updatedCart, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Remove all cart items
export const removeAllCartItems = async (req: Request, res: Response, next: NextFunction) => {
    const cart = await Cart.findOneAndUpdate({ userId: req.body.userId }, { items: [] }, { new: true }).lean();

    if (!cart) throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);

    return res.status(StatusCodes.NO_CONTENT).json(
        customResponse({
            data: null,
            success: true,
            status: StatusCodes.NO_CONTENT,
            message: ReasonPhrases.NO_CONTENT,
        }),
    );
};

// @Update  cart item quantity
export const updateCartItemQuantity = async (req: Request, res: Response, next: NextFunction) => {
    const product = await ProductVariation.findById(req.body.productId).select({ stock: 1 }).lean();
    if (!product) throw new BadRequestError(`Not found product with Id: ${req.body.productId}`);

    if (req.body.quantity < 1) throw new BadRequestError(`Quantity must be at least 1`);
    if (req.body.quantity > product.stock!) {
        req.body.quantity = product.stock;
    }
    const updatedQuantity = await Cart.findOneAndUpdate(
        { userId: req.body.userId, 'items.productId': req.body.productId },
        { $set: { 'items.$.quantity': req.body.quantity } },
        { new: true },
    );
    if (!updatedQuantity)
        throw new BadRequestError(
            `Not found product with Id: ${req.body.productId} inside this cart or cart not found`,
        );

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: updatedQuantity, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
        );
};
