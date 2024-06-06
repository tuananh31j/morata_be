import mongoose, { Schema } from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: {
    // Reference the User model
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
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
    },
  ],
  totalPrice: {
    // total price after calculate tax fee
    type: Number,
    required: true,
  },
  tax: {
    type: Number,
  },
  shippingFee: {
    type: Number,
  },
  shippingAddress: {
    type: Schema.Types.ObjectId,
    ref: 'ShippingAddress',
  },
  paymentMethod: {
    type: String,
    trim: true,
    enum: ['cash', 'stripe'],
    required: true,
  },
  orderStatus: {
    type: String,
    trim: true,
    default: 'pending',
    enum: ['pending', 'confirmed', 'on_delivering', 'done'],
  },
});

export default mongoose.model('Order', orderSchema);
