import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                type: {
                    productVariation: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'ProductVariation',
                        required: true,
                    },
                    quantity: {
                        type: Number,
                        required: true,
                        min: 1,
                    },
                    _id: false,
                },
                default: [],
            },
        ],
    },
    {
        versionKey: false,
        timestamps: false,
    },
);

export default mongoose.model('Cart', cartSchema);
