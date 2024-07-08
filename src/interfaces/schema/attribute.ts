import mongoose from 'mongoose';

export interface AttributeValue {
  name: string;
  attributeId: mongoose.Types.ObjectId;
}

export interface Attribute {
  name: string;
  detailId: mongoose.Types.ObjectId;
}
