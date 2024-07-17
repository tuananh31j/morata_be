import { PRODUCT_STATUS } from '@/constant';
import { IProductSchema } from '@/interfaces/schema/product';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    imageUrlRefs: [],
    thumbnail: {
      type: String,
    },
    thumbnailUrlRef: {
      type: String,
    },
    parentSku: { type: String },

    status: {
      type: String,
      default: PRODUCT_STATUS.NEW,
      enum: [PRODUCT_STATUS.NEW, PRODUCT_STATUS.USED],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    attributes: [
      {
        type: Schema.Types.Mixed,
      },
    ],

    // @ref
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    reviewIds: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Review',
        },
      ],
      default: [],
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true, versionKey: false },
);

ProductSchema.plugin(paginate);

const Product: PaginateModel<IProductSchema> = mongoose.model<IProductSchema, PaginateModel<IProductSchema>>(
  'Product',
  ProductSchema,
);

export default Product;
