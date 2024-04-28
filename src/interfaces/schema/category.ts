import { SoftDeleteDocument } from 'mongoose-delete';

export interface ICategorySchema extends SoftDeleteDocument {
  name: string;
  description: string;
}
