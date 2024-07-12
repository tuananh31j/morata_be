import mongoose from 'mongoose';

const VariationSchema = new mongoose.Schema(
  {
    name: String,
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('Variation', VariationSchema);
