import mongoose, { Schema } from 'mongoose';

const attributeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            unique: true,
            require: true,
        },
        attributeKey: {
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

attributeSchema.pre('save', async function (next) {
    this.attributeKey = this.name!.toLowerCase().replace(/ /g, '_');
    next();
});
const Attribute = mongoose.model('Attribute', attributeSchema);

export default Attribute;
