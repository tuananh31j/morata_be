import { Schema, Document } from 'mongoose';

export interface IProductSchema extends Document {
  name: string;
  description: string;
  basePrice: number;
  thumbnail: string;
  thumbnailUrlRef: string;
  images: string[];
  imageUrlRefs: string[];
  categoryId: Schema.Types.ObjectId;

  details: Schema.Types.ObjectId[];
  variations: Schema.Types.ObjectId[];

  discount: number;
  isAvailable: boolean;
  isDeleted: boolean;
  parentSku: string;
}
