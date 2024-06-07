import { OrderSchema } from '@/interfaces/schema/order';
import mongoose, { Schema } from 'mongoose';

const orderSchema = new mongoose.Schema<OrderSchema>({
  userId: {
    type: String,
  },
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      _id: false,
    },
  ],
  totalPrice: {
    // total price after calculate tax fee
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
    default: 0.1,
  },
  shippingFee: {
    type: Number,
    default: 0,
  },
  customerInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  shippingAddress: {
    city: String,
    country: String,
    line1: String,
    line2: String,
    postal_code: String,
    state: String,
  },
  paymentMethod: {
    type: String,
    trim: true,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  orderStatus: {
    type: String,
    trim: true,
    default: 'pending',
    enum: ['pending', 'confirmed', 'on_delivering', 'done'],
  },
});

export default mongoose.model<OrderSchema>('Order', orderSchema);
