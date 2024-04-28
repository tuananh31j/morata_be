import { SoftDeleteDocument } from 'mongoose-delete';

export interface IBrandSchema extends SoftDeleteDocument {
  name: string;
  description: string;
  country: string;
}
