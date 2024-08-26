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
                type: { key: String, name: String, value: String },
                _id: false,
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
        priceFilter: Number,
        attributeVariantForFilter: [
            {
                type: { key: String, name: String, value: String },
                _id: false,
            },
        ],
    },
    { timestamps: true, versionKey: false },
);

const Product = mongoose.model<IProductSchema>('Product', ProductSchema);

export default Product;
