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
  shippingFee: number;
  customerInfo: {
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
  orderStatus: string;
}
