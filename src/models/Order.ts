import { ORDER_STATUS, PAYMENT_METHOD } from '@/constant/order';
import { OrderSchema } from '@/interfaces/schema/order';
import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
                name: {
                    type: String,
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    required: true,
                },
            },
        ],
        totalPrice: {
            // total price after calculate tax fee
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0.1,
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        receiverInfo: {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
        },
        customerInfo: {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
        },

        shippingAddress: {
            city: String,
            country: String,
            line1: String,
            line2: String,
            postal_code: String,
            state: String,
        },
        paymentMethod: {
            type: String,
            trim: true,
            required: true,
            enum: Object.values(PAYMENT_METHOD),
            default: PAYMENT_METHOD.CASH,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
        },
        currentOrderStatus: {
            type: String,
            trim: true,
            default: ORDER_STATUS.PENDING,
            enum: Object.values(ORDER_STATUS),
        },
        orderStatusLogs: [
            {
                statusChangedBy: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                orderStatus: {
                    type: String,
                    trim: true,
                    enum: Object.values(ORDER_STATUS),
                },
                reason: {
                    type: String,
                    default: '',
                },
                createdAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },
    {
        versionKey: false,
        timestamps: true,
    },
);
orderSchema.pre('save', async function (next) {
    if (this.isNew) {
        const statusLog = {
            statusChangedBy: this.userId,
            orderStatus: ORDER_STATUS.PENDING,
            createdAt: this.createdAt,
        };
        this.orderStatusLogs.push(statusLog);
    }
    next();
});

const Order = mongoose.model<OrderSchema>('Order', orderSchema);

export default Order;
