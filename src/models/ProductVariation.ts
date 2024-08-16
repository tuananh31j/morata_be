import { boolean } from 'joi';
import mongoose from 'mongoose';

const productVariationSchema = new mongoose.Schema(
    {
        price: {
            type: Number,
            required: true,
        },
        image: { type: String },
        imageUrlRef: String,
        stock: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        sku: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        variantAttributes: mongoose.Schema.Types.Mixed,
        // @ref
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
    },
    { timestamps: true, versionKey: false },
);

productVariationSchema.post('save', async function (doc) {
    await mongoose
        .model('Product')
        .findByIdAndUpdate(doc.productId, { $push: { variationIds: doc._id } }, { new: true });
});

const ProductVariation = mongoose.model('ProductVariation', productVariationSchema);

export default ProductVariation;
