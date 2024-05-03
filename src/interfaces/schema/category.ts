import { Document } from 'mongoose';

export interface ICategorySchema extends Document {
  name: string;
  description: string;
}
