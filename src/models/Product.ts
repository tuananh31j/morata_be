import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      min: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    attributes: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('Product', productSchema);
