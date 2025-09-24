
const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
    if (!cart || cart.items.length === 0) return res.status(400).json({ msg: 'Cart empty' });

    let total = 0;
    const items = cart.items.map(item => {
      total += item.productId.price * item.quantity;
      return { productId: item.productId._id, quantity: item.quantity, price: item.productId.price };
    });

    const order = new Order({ userId: req.user.id, items, total });
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};