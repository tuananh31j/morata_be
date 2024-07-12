import { Attribute, AttributeValue } from '@/interfaces/schema/attribute';
import mongoose, { Schema } from 'mongoose';

const DetailValueSchema = new mongoose.Schema<Attribute>(
  {
    name: {
      type: String,
      required: true,
    },
    detailId: {
      type: Schema.Types.ObjectId,
      ref: 'Detail',
    },
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('Attribute', DetailValueSchema);
