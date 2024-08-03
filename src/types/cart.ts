import { Types } from 'mongoose';

export type CartItem = {
    name: string;
    productVariation: Types.ObjectId;
    quantity: number;
};

export type CartData = {
    userId: Types.ObjectId;
    items: CartItem[];
};
