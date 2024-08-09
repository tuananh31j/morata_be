import { Document, Schema } from 'mongoose';

export interface ICategorySchema extends Document {
    name: string;
    attributeIds: Schema.Types.ObjectId[];
}
