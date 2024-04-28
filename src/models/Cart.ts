import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user: {
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
      total: Number, //total price
      discountPercentage: Number,
      discountedPrice: Number,
      thumbnail: String,
    },
  ],
  total: Number, // total price
  discountedTotal: Number,
  totalProducts: Number,
  totalQuantity: Number,
});

export default mongoose.model('Cart', cartSchema);
