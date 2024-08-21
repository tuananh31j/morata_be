import { NotAcceptableError, NotFoundError } from '@/error/customError';
import { ItemOrder } from '@/interfaces/schema/order';
import ProductVariation from '@/models/ProductVariation';

export const updateStockOnCreateOrder = async (dataItems: ItemOrder[]) => {
    return await Promise.all(
        dataItems.map(async (item: ItemOrder) => {
            await ProductVariation.updateOne(
                { _id: item.productVariationId },
                {
                    $inc: {
                        sold: item.quantity, // Increment "sold" by item.quantity
                        stock: -item.quantity, // Decrement "stock" by item.quantity
                    },
                },
            );
        }),
    );
};
export const updateStockOnCancelOrder = async (dataItems: ItemOrder[]) => {
    return await Promise.all(
        dataItems.map(async (item: ItemOrder) => {
            await ProductVariation.updateOne(
                { _id: item.productVariationId },
                {
                    $inc: {
                        sold: -item.quantity, // Decrement "sold" by item.quantity
                        stock: item.quantity, // Increment "stock" by item.quantity
                    },
                },
            );
        }),
    );
};

export const checkProductStatus = async (dataItems: ItemOrder[]) => {
    const products = await ProductVariation.find({
        _id: { $in: dataItems.map((item: ItemOrder) => item.productVariationId) },
    })
        .select('isActive stock')
        .populate({
            path: 'productId',
            select: 'isHide',
        });
    if (!products) throw new NotFoundError('Not found product');

    const isOutOfStock = products.some((item) => {
        const productTarget = dataItems.find((pro: ItemOrder) => pro.productVariationId === String(item._id));
        if (productTarget!.quantity > item.stock!) {
            return true;
        }
    });
    const isProductHidden = products.some((item, i) => {
        if ((item.productId as any).isHide) {
            return true;
        }
    });
    const isProductNotActive = products.some((item, i) => {
        if (!item.isActive) {
            return true;
        }
    });
    if (isProductNotActive) {
        throw new NotAcceptableError('Sản phẩm không hoạt động');
    }
    if (isProductHidden) {
        throw new NotAcceptableError('Sản phẩm không tồn tại');
    }
    if (isOutOfStock) {
        throw new NotAcceptableError('Sản phẩm đã hết hàng');
    }
};
