import mongoose from 'mongoose';

const productVariationSchema = new mongoose.Schema(
    {
        price: {
            type: Number,
        },
        image: { type: String },
        imageUrlRef: String,
        stock: {
            type: Number,
        },
        sku: {
            type: String,
        },
        color: {
            type: String,
        },
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
    const test = await mongoose
        .model('Product')
        .findByIdAndUpdate(doc.productId, { $push: { variationIds: doc._id } }, { new: true });
});

const ProductVariation = mongoose.model('ProductVariation', productVariationSchema);

export default ProductVariation;
