import { LOCATION_TYPES } from '@/constant/location';
import mongoose from 'mongoose';

const LocationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: LOCATION_TYPES.SHIPPING_ADDRESS,
            enum: [LOCATION_TYPES.DEFAULT, LOCATION_TYPES.SHIPPING_ADDRESS],
        },
        name: String,
        email: String,
        phone: String,
        address: {
            city: {
                type: String,
                required: true,
            },
            country: {
                type: String,
                required: true,
            },
            line1: {
                type: String,
                required: true,
            },
            line2: {
                type: String,
                required: true,
            },
            postal_code: {
                type: Number,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
        },
    },
    { versionKey: false, timestamps: false },
);
const Location = mongoose.model('Location', LocationSchema);

export default Location;
