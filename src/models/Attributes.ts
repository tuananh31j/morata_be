import mongoose from 'mongoose';
import { ProductSchema } from './Product';

const attributeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  },
});

ProductSchema.add({ attributes: [attributeSchema] });
