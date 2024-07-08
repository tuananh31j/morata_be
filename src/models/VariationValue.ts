import { values } from 'lodash';
import mongoose from 'mongoose';

const VariationValueSchema = new mongoose.Schema(
  {
    name: String,
    variationId: mongoose.Types.ObjectId,
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

export default mongoose.model('AttributeValue', VariationValueSchema);
