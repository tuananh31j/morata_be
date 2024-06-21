import { OrderSchema } from '@/interfaces/schema/order';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const OrderSchema = new mongoose.Schema<OrderSchema>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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
    receiverInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
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
      enum: ['cash', 'card'],
      default: 'cash',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    canceledBy: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    description: {
      type: String,
    },
    orderStatus: {
      type: String,
      trim: true,
      default: 'pending',
      enum: ['pending', 'cancelled', 'confirmed', 'shipping', 'delivered', 'done'],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

OrderSchema.plugin(paginate);

const Order: PaginateModel<OrderSchema> = mongoose.model<OrderSchema, PaginateModel<OrderSchema>>('Order', OrderSchema);

export default Order;
