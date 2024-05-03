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
  category: Schema.Types.ObjectId;
  brand: Schema.Types.ObjectId;
  reviews: Schema.Types.ObjectId[];
  deleted: boolean;
  attributes: Record<string, any>;
}
