import { BadRequestError, NotFoundError } from '@/error/customError';
import customResponse from '@/helpers/response';
import Cart from '@/models/Cart';
import ProductVariation from '@/models/ProductVariation';
import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

// @Get cart by user
export const getCartByUser = async (req: Request, res: Response, next: NextFunction) => {
    const cartUser = await Cart.findOne({ userId: req.params.id })
        .populate({
            path: 'items.productVariation',
            populate: {
                path: 'productId',
                select: { name: 1, isHide: 1 },
            },
        })
        .lean();
    if (!cartUser) throw new NotFoundError('Not found cart or cart is not exist.');
    const filteredProducts = cartUser.items.filter((item) => (item.productVariation as any).productId.isHide !== true);
    cartUser.items = filteredProducts;
    return res
        .status(StatusCodes.OK)
        .json(customResponse({ data: cartUser, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }));
};

// @Add to cart
export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    let updatedCart = null;
    const [product, currentCart] = await Promise.all([
        ProductVariation.findById(req.body.productVariation).select({ stock: 1 }).lean(),
        Cart.findOne({ userId: req.body.userId })
            .select({ items: 1 })
            .lean<{ items: { productVariation: string; quantity: number }[] }>(),
    ]);

    if (!product) throw new BadRequestError(`Not found product with id ${req.body.productVariation}`);
    if (req.body.quantity < 1) throw new BadRequestError(`Quantity must be at least 1`);
    if (req.body.quantity > product.stock!) req.body.quantity = product.stock;

    if (currentCart && currentCart.items.length > 0) {
        const productInThisCart = currentCart.items.find((item) => item.productVariation == req.body.productVariation);
        const currentQuantity = productInThisCart?.quantity || 0;
        const newQuantity = currentQuantity + req.body.quantity;
        updatedCart = await Cart.findOneAndUpdate(
            { userId: req.body.userId, 'items.productVariation': req.body.productVariation },
            { $set: { 'items.$.quantity': newQuantity > product.stock! ? product.stock! : newQuantity } },
            { new: true, upsert: false },
        );
    }

    if (!updatedCart) {
        updatedCart = await Cart.findOneAndUpdate(
            { userId: req.body.userId },
            { $push: { items: { productVariation: req.body.productVariation, quantity: req.body.quantity } } },
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
        { $pull: { items: { productVariation: req.body.productVariation } } },
        { new: true },
    );
    if (!updatedCart) throw new BadRequestError(`Not found cart with userId: ${req.body.userId}`);
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
    const product = await ProductVariation.findById(req.body.productVariation).select({ stock: 1 }).lean();
    if (!product) throw new BadRequestError(`Not found product with Id: ${req.body.productVariation}`);

    if (req.body.quantity < 1) throw new BadRequestError(`Quantity must be at least 1`);
    if (req.body.quantity > product.stock!) req.body.quantity = product.stock;

    const updatedQuantity = await Cart.findOneAndUpdate(
        { userId: req.body.userId, 'items.productVariation': req.body.productVariation },
        { $set: { 'items.$.quantity': req.body.quantity } },
        { new: true },
    );
    if (!updatedQuantity)
        throw new BadRequestError(
            `Not found product with Id: ${req.body.productVariation} inside this cart or cart not found`,
        );

    return res
        .status(StatusCodes.OK)
        .json(
            customResponse({ data: updatedQuantity, success: true, status: StatusCodes.OK, message: ReasonPhrases.OK }),
        );
};
