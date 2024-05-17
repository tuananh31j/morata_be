import { ICategorySchema } from '@/interfaces/schema/category';
import mongoose from 'mongoose';

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
    subCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attribute' }],
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

const Category = mongoose.model<ICategorySchema>('Category', CategorySchema);
export default Category;
