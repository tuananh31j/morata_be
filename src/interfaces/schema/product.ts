import { Schema, Document } from 'mongoose';

export interface IProductSchema extends Document {
  name: string;
  description: string;
  thumbnail: string;
  thumbnailUrlRef: string;
  images: string[];
  imageUrlRefs: string[];

  categoryId: Schema.Types.ObjectId;
  brandId: Schema.Types.ObjectId;

  details: Schema.Types.ObjectId[];
  variations: Schema.Types.ObjectId[];

  rating: number;
  reviewIds: Schema.Types.ObjectId[];
  discountPercentage: number;
  isAvailable: boolean;
  isDeleted: boolean;
  parentSku: string;
  status: string;
}
