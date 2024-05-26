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
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 5,
    },
    stock: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
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
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    variations: Schema.Types.Mixed,
  },
  { timestamps: true, versionKey: false },
);

const variationAttributeSchema = new Schema({
  attribute: {
    type: String,
    required: true,
  },
  value: {
    type: Schema.Types.Mixed,
  },
});

ProductSchema.add({ variations: variationAttributeSchema });

ProductSchema.plugin(paginate);

const Product: PaginateModel<IProductSchema> = mongoose.model<IProductSchema, PaginateModel<IProductSchema>>(
  'Product',
  ProductSchema,
);

export default Product;
