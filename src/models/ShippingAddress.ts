import mongoose from 'mongoose';

const ShippingAddressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
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
});

export default mongoose.model('ShippingAddress', ShippingAddressSchema);
