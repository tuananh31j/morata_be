import { IBrandSchema } from '@/interfaces/schema/brand';
import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema<IBrandSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const Brand = mongoose.model<IBrandSchema>('Brand', BrandSchema);

export default Brand;
