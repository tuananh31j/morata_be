import { PRODUCT_STATUS } from '@/constant';
import { IProductSchema } from '@/interfaces/schema/product';
import mongoose, { Schema } from 'mongoose';

export const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        discount: {
            type: Number,
            min: 0,
            max: 99,
            default: 0,
        },
        images: [
            {
                type: String,
            },
        ],
        imageUrlRefs: [],
        thumbnail: {
            type: String,
        },
        thumbnailUrlRef: {
            type: String,
        },
        parentSku: { type: String },

        status: {
            type: String,
            default: PRODUCT_STATUS.NEW,
            enum: [PRODUCT_STATUS.NEW, PRODUCT_STATUS.USED],
        },
        isAvailable: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isHide: {
            type: Boolean,
            default: false,
        },
        attributes: [
            {
                type: { key: String, value: String },
                // required: true,
            },
        ],
        rating: { type: Number, default: 0 },
        reviewCount: {
            type: Number,
            default: 0,
        },
        // @ref
        variationIds: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'ProductVariation',
                },
            ],
            default: [],
        },

        brandId: {
            type: Schema.Types.ObjectId,
            ref: 'Brand',
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    { timestamps: true, versionKey: false },
);

ProductSchema.virtual('price').get(async function () {
    const ProductVariation = mongoose.model('ProductVariation');
    const variations = await ProductVariation.find({ _id: { $in: this.variationIds } }).sort({ price: 1 });
    if (variations.length === 0) return 0;
    return variations;
});

// Đảm bảo trường ảo được bao gồm trong kết quả trả về
ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });
const Product = mongoose.model<IProductSchema>('Product', ProductSchema);

export default Product;
