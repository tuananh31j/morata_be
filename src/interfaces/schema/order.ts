import mongoose from 'mongoose';

interface ItemOrder {
    name: string;
    quantity: number;
    price: number;
    image: string;
}

export interface OrderSchema {
    userId: mongoose.Schema.Types.ObjectId;
    items: ItemOrder[];
    totalPrice: number;
    tax: number;
    coupon: string;
    shippingFee: number;
    shippingMethod: string;
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
        country: string;
        province: string;
        district: string;
        ward: string;
        address: string;
        provinceId: number;
        districtId: number;
        wardCode: string;
    };
    paymentMethod: string;
    isPaid: boolean;
    canceledBy: string;
    description: string;
    orderStatus: string;
}
