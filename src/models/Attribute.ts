import mongoose from 'mongoose';

const ValueAttributesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const ValueAttribute = mongoose.model('ValueAttribute', ValueAttributesSchema);

const AttributeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    values: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ValueAttribute' }],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

export const Attribute = mongoose.model('Attributes', AttributeSchema);
