import mongoose from 'mongoose';

export interface AttributeValue {
  name: string;
  value: any;
  _id?: boolean;
}

export interface Attribute {
  attribute: string;
  categoryId: mongoose.Types.ObjectId;
  details: AttributeValue[];
}
