import { PRODUCT_STATUS } from '@/constant';
import { IProductItemSchema } from '@/interfaces/schema/productItem';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const ProductItemSchema = new mongoose.Schema<IProductItemSchema>(
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
    stock: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    status: {
      type: String,
      default: PRODUCT_STATUS.NEW,
      enum: [PRODUCT_STATUS.NEW, PRODUCT_STATUS.USED],
    },
    reviewIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    details: {
      type: [{ key: String, value: String }],
      required: true,
    },
    variants: {
      type: [{ key: String, value: String }],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
);

ProductItemSchema.plugin(paginate);

const ProductItem: PaginateModel<IProductItemSchema> = mongoose.model<
  IProductItemSchema,
  PaginateModel<IProductItemSchema>
>('ProductItem', ProductItemSchema);

export default ProductItem;
