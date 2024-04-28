import { ICategorySchema } from '@/interfaces/schema/category';
import mongoose from 'mongoose';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

const CategorySchema = new mongoose.Schema<ICategorySchema>(
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
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

CategorySchema.plugin(MongooseDelete, { deletedAt: true });

const Category: SoftDeleteModel<ICategorySchema> = mongoose.model<ICategorySchema>(
  'Category',
  CategorySchema,
) as MongooseDelete.SoftDeleteModel<ICategorySchema>;

export default Category;
