import { is } from 'date-fns/locale';
import mongoose from 'mongoose';

export interface ItemOrder {
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
    isReviewed: boolean;
}

export interface OrderSchema {
    userId: mongoose.Schema.Types.ObjectId;
    items: ItemOrder[];
    totalPrice: number;
    tax: number;
    shippingFee: number;
    customerInfo: {
        name: string;
        email: string;
        phone: string;
    };
    receiverInfo: {
        name: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        city: string;
        country: string;
        line1: string;
        line2: string;
        postal_code: string;
        state: string;
    };
    paymentMethod: string;
    isPaid: boolean;
    canceledBy: string;
    description: string;
    orderStatus: string;
}
