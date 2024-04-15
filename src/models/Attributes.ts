import mongoose from 'mongoose';
import { productSchema } from './Product';

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
});

productSchema.add({ attributes: [attributeSchema] });
