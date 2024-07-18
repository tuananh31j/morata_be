import { IProductSchema } from '@/interfaces/schema/product';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

export const ProductSchema = new Schema<IProductSchema>(
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
    discount: {
      type: Number,
      min: 0,
      default: 0,
    },
    basePrice: {
      type: Number,
      required: true,
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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    parentSku: { type: String },

    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
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
