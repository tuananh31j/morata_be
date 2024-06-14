import { Attribute, AttributeValue } from '@/interfaces/schema/attribute';
import mongoose from 'mongoose';

const AttributeValue = new mongoose.Schema<AttributeValue>(
  {
    name: { type: String },
    value: { type: mongoose.Schema.Types.Mixed },
    _id: false,
  },
  {
    versionKey: false,
    timestamps: false,
  },
);

const AttributeSchema = new mongoose.Schema<Attribute>(
  {
    attribute: {
      type: String,
      required: true,
      trim: true,
      lowerCase: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    details: {
      type: [AttributeValue],
      default: [],
    },
  },
  { versionKey: false, timestamps: false },
);

export default mongoose.model('Attribute', AttributeSchema);
