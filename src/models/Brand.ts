import { IBrandSchema } from '@/interfaces/schema/brand';
import mongoose from 'mongoose';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

const BrandSchema = new mongoose.Schema<IBrandSchema>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

BrandSchema.plugin(MongooseDelete, { deletedAt: true });

const Brand: SoftDeleteModel<IBrandSchema> = mongoose.model<IBrandSchema>(
  'Brand',
  BrandSchema,
) as MongooseDelete.SoftDeleteModel<IBrandSchema>;

export default Brand;
