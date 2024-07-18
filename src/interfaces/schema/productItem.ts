import { Schema, Document } from 'mongoose';

export interface IProductItemSchema extends Document {
  productId: Schema.Types.ObjectId;
  price: number;
  stock: number;
  sku: string;
  rating: number;
  status: string;
  reviewIds: Schema.Types.ObjectId[];
  details: Schema.Types.ObjectId[];
  variants: Schema.Types.ObjectId[];
  isDeleted: boolean;
  isAvailable: boolean;
}
