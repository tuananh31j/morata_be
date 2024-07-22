import mongoose, { Schema } from 'mongoose';

const AttributeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
        },
        type: { type: String, enum: ['manual', 'options'] },
        values: [
            {
                type: String || Number,
                default: [],
            },
        ],
    },
    { versionKey: false, timestamps: false },
);

const Attribute = mongoose.model('Attribute', AttributeSchema);

export default Attribute;
