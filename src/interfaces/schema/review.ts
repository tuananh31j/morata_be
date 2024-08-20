import { Schema, Document } from 'mongoose';

export interface IReviewSchema extends Document {
    content: string;
    rating: number;
    userId: Schema.Types.ObjectId;
    productId: Schema.Types.ObjectId;
    createAt: Date;
}
export interface IReportSchema extends Document {
    content: string;
    reason: string;
    userId: Schema.Types.ObjectId;
    reviewId: Schema.Types.ObjectId;
    createAt: Date;
}
