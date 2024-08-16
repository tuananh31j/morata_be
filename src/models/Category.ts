import { ICategorySchema } from '@/interfaces/schema/category';
import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        attributeIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Attribute',
            },
        ],
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

const Category = mongoose.model<ICategorySchema>('Category', CategorySchema);
export default Category;
