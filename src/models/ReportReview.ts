import { IReportSchema } from '@/interfaces/schema/review';
import mongoose from 'mongoose';
import { ReportReason } from '@/constant/ReasonReport';

const reportSchema = new mongoose.Schema(
    {
        reason: {
            type: String,
            required: true,
            enum: [
                ReportReason.InappropriateContent,
                ReportReason.Spam,
                ReportReason.OffensiveLanguage,
                ReportReason.Other,
                ReportReason.Harassment,
                ReportReason.Misinformation,
                ReportReason.advertisement,
            ],
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
        createAt: {
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
