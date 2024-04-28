import { Schema } from 'mongoose';
import { SoftDeleteDocument } from 'mongoose-delete';

export interface IProductSchema extends SoftDeleteDocument {
  name: string;
  description?: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  images: string[];
  thumbnail?: string;
  category?: Schema.Types.ObjectId;
  brand?: Schema.Types.ObjectId;
  reviews?: Schema.Types.ObjectId[];
  attributes?: Record<string, any>;
}
