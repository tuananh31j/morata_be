import mongoose, { Schema } from 'mongoose';

const DetailSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('Detail', DetailSchema);
