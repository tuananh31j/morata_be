import { AttributeType } from '@/constant/attributeType';
import { Document } from 'mongoose';

export interface IAttributeSchema extends Document {
    name: string;
    attributeKey: string;
    isVariant: boolean;
    isRequired: boolean;
    type: AttributeType;
    values: (string | number)[];
}
