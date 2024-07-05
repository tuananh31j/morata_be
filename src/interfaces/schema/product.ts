import { Schema, Document } from 'mongoose';

export interface IProductSchema extends Document {
  name: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  images: string[];
  imageUrlRefs: string[];
  thumbnail: string;
  thumbnailUrlRef: string;
  sku: string;
  categoryId: Schema.Types.ObjectId;
  brandId: Schema.Types.ObjectId;
  reviewIds: Schema.Types.ObjectId[];
  isAvailable: boolean;
  isDeleted: boolean;
  details: any[];
  variations: Schema.Types.Mixed;
}
