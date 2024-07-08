import { AttributeValue } from '@/interfaces/schema/attribute';
import mongoose, { Schema } from 'mongoose';

const AttributeValue = new mongoose.Schema<AttributeValue>(
  {
    name: { type: String },
    attributeId: {
      type: Schema.Types.ObjectId,
      ref: 'Attribute',
    },
  },
  {
    versionKey: false,
    timestamps: false,
  },
);
