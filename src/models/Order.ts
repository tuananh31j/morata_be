import { ORDER_STATUS } from '@/constant';
import { ROLE } from '@/constant/allowedRoles';
import { PAYMENT_METHODS } from '@/constant/paymentMethod';
import { OrderSchema } from '@/interfaces/schema/order';
import mongoose, { PaginateModel, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const OrderItemSchema = new mongoose.Schema(
    {
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
    {
        _id: false,
        id: false,
        versionKey: false,
        timestamps: false,
    },
);

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [OrderItemSchema],
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
            name: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
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
            enum: Object.values(PAYMENT_METHODS),
            default: PAYMENT_METHODS.CASH,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        note: {
            type: String,
        },
        orderStatus: {
            type: String,
            trim: true,
            default: ORDER_STATUS.PENDING,
            enum: Object.values(ORDER_STATUS),
        },
    },
    {
        versionKey: false,
        timestamps: true,
    },
);

OrderSchema.plugin(paginate);

const Order: PaginateModel<OrderSchema> = mongoose.model<OrderSchema, PaginateModel<OrderSchema>>('Order', OrderSchema);

export default Order;
