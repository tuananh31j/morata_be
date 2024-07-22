import { Types } from 'mongoose';

export type CartItem = {
    productId: Types.ObjectId;
    name: string;
    price: number;
    thumbnail: string;
    quantity: number;
};

export type CartData = {
    userId: string;
    items: CartItem[];
};
