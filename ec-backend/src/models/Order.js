
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number },
  }],
  total: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed'] },
  stripeSessionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
