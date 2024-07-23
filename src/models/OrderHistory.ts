import { ORDER_STATUS } from '@/constant';
import mongoose from 'mongoose';

const orderHistorySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        orderStatus: {
            type: String,
            trim: true,
            enum: Object.values(ORDER_STATUS),
        },
        reason: {
            type: String,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

const OrderHistory = mongoose.model('OrderHistory', orderHistorySchema);

export default OrderHistory;
