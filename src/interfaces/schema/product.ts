import { Schema, Document } from 'mongoose';

export interface IProductSchema extends Document {
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  images: string[];
  thumbnail: string;
  sku: string;
  categoryId: Schema.Types.ObjectId;
  brandId: Schema.Types.ObjectId;
  reviewIds: Schema.Types.ObjectId[];
  isAvailable: boolean;
  isDeleted: boolean;
  variations: Schema.Types.Mixed;
}
