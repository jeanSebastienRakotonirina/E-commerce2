const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { isAdmin } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, { isAdmin }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'email')
      .populate('items.productId', 'name price');
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const validStatuses = ['pending', 'paid', 'failed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('userId', 'email')
      .populate('items.productId', 'name price');
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};