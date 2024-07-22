import mongoose, { Schema } from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);

reviewSchema.index({ productId: 1 });
reviewSchema.post('save', async function (doc) {
    try {
        const product = await mongoose.model('Product').findById(doc.productId);

        if (product) {
            const reviews = await mongoose.model('Review').find({ productId: doc.productId });
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
            const reviewCount = reviews.length;

            await mongoose.model('Product').findByIdAndUpdate(
                doc.productId,
                {
                    $push: { reviewIds: doc._id },
                    rating: averageRating,
                    reviewCount: reviewCount,
                },
                { new: true },
            );
        }
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
});
export default mongoose.model('Review', reviewSchema);
