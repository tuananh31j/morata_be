import mongoose from 'mongoose';

const ProductItemSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
    },
    image: { type: String },
    imageUrlRef: String,
    stock: {
      type: Number,
    },
    sku: {
      type: String,
    },
    color: {
      type: String,
    },
    // @ref
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

const ProductItem = mongoose.model('ProductItem', ProductItemSchema);

export default ProductItem;
