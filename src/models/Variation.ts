import mongoose from 'mongoose';

const VariationSchema = new mongoose.Schema(
  {
    name: String,
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('Variation', VariationSchema);
