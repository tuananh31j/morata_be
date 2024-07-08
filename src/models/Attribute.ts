import { Attribute, AttributeValue } from '@/interfaces/schema/attribute';
import mongoose, { Schema } from 'mongoose';

const AttributeSchema = new mongoose.Schema<Attribute>(
  {
    name: String,
    detailId: {
      type: Schema.Types.ObjectId,
      ref: 'Detail',
    },
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('Attribute', AttributeSchema);
