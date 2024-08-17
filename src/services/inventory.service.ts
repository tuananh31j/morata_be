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
