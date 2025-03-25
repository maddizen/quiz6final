const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, quantity: Number }],
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  total: Number,
  paid: { type: Boolean, default: false },
  delivered: { type: Boolean, default: false }
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
