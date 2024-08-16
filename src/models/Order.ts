import { ORDER_STATUS, PAYMENT_METHOD, SHIPPING_METHOD } from '@/constant/order';
import { OrderSchema } from '@/interfaces/schema/order';
import mongoose, { PaginateModel } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const OrderItemSchema = new mongoose.Schema(
    {
        productId: {
            type: String,
            required: true,
        },
        productVariationId: {
            type: String,
            required: true,
        },
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
        isReviewed: {
            type: Boolean,
        },
    },
    {
        _id: false,
        id: false,
        versionKey: false,
        timestamps: false,
    },
);

const OrderSchema = new mongoose.Schema<OrderSchema>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        items: [OrderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0.1,
        },
        coupon: {
            type: String,
            default: null,
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        shippingMethod: {
            type: String,
            default: SHIPPING_METHOD.STANDARD,
            enum: [SHIPPING_METHOD.STANDARD, SHIPPING_METHOD.SPECIAL],
        },
        customerInfo: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true },
        },
        receiverInfo: {
            name: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
        },
        shippingAddress: {
            country: {
                type: String,
                default: 'Viet Nam',
            },
            province: String,
            district: String,
            ward: String,
            address: String,
            provinceId: Number,
            districtId: Number,
            wardCode: String,
        },
        paymentMethod: {
            type: String,
            trim: true,
            required: true,
            enum: [PAYMENT_METHOD.CASH, PAYMENT_METHOD.CARD],
            default: PAYMENT_METHOD.CASH,
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        canceledBy: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        description: {
            type: String,
        },
        orderStatus: {
            type: String,
            trim: true,
            default: ORDER_STATUS.PENDING,
            enum: [
                ORDER_STATUS.PENDING,
                ORDER_STATUS.CANCELLED,
                ORDER_STATUS.CONFIRMED,
                ORDER_STATUS.SHIPPING,
                ORDER_STATUS.DELIVERED,
                ORDER_STATUS.DONE,
            ],
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
