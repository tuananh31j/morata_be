import { AttributeType } from '@/constant/attributeType';
import { IAttributeSchema } from '@/interfaces/schema/attribute';
import { convertString } from '@/utils/convertString';
import mongoose from 'mongoose';

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
        isRequired: { type: Boolean, default: false },
        isVariant: { type: Boolean, default: false },
        isFilter: { type: Boolean, default: false },
        type: { type: String, enum: Object.values(AttributeType), default: AttributeType.Manual },
        values: [
            {
                type: String || Number,
                default: [],
            },
        ],
    },
    { versionKey: false, timestamps: true },
);

const Attribute = mongoose.model<IAttributeSchema>('Attribute', attributeSchema);

export default Attribute;
