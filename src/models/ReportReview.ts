import { IReportSchema } from '@/interfaces/schema/review';
import mongoose from 'mongoose';
import { ReportReason, ReportStatus } from '@/constant/ReasonReport';

const reportSchema = new mongoose.Schema(
    {
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: ReportStatus.UnderReview,
            enum: [ReportStatus.UnderReview, ReportStatus.NoViolation, ReportStatus.ContentRemoved],
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        reviewId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        versionKey: false,
    },
);
const ReportReview = mongoose.model<IReportSchema>('ReportReview', reportSchema);
export default ReportReview;
