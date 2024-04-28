import { IProductSchema } from '@/interfaces/schema/product';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';
import paginate from 'mongoose-paginate-v2';

// Define the interface for the product schema

// Define the product schema
const ProductSchema = new Schema<IProductSchema>(
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
      default: 0,
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
    },
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    attributes: {
      type: Schema.Types.Mixed,
    },
  },
  { timestamps: true, versionKey: false },
);

ProductSchema.plugin(MongooseDelete, { deletedAt: true });
ProductSchema.plugin(paginate);

interface IProductModel extends PaginateModel<IProductSchema> {}

const Product: SoftDeleteModel<IProductSchema> = mongoose.model<IProductSchema>(
  'Product',
  ProductSchema,
) as MongooseDelete.SoftDeleteModel<IProductSchema>;

export default Product;
