import { ref } from 'joi';
import { max } from 'lodash';
import mongoose, { Schema } from 'mongoose';

const ProductItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    reviewIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    details: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Detail',
        },
      ],
      required: true,
    },
    variations: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Variation' }],
    },
  },
  { timestamps: true, versionKey: false },
);

export default mongoose.model('ProductItem', ProductItemSchema);
