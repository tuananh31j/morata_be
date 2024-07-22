import { Document } from 'mongoose';

export interface IBrandSchema extends Document {
    name: string;
    description: string;
    country: string;
}
