
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: 'text' },
  description: { type: String, required: true, index: 'text' },
  price: { type: Number, required: true },
  color: { type: String },
  size: { type: String },
  stock: { type: Number, default: 0 },
  imageUrl: { type: String },
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);