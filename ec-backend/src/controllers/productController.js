
const Product = require('../models/Product');
const { put } = require('@vercel/blob');

exports.getProducts = async (req, res) => {
  const { name, color, size, description } = req.query;
  let query = {};
  if (name) query.name = { $regex: name, $options: 'i' };
  if (color) query.color = color;
  if (size) query.size = size;
  if (description) query.description = { $regex: description, $options: 'i' };

  try {
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.createProduct = async (req, res) => {
  const { name, description, price, color, size, stock } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ msg: 'No image uploaded' });

  try {
    const { url } = await put(file.originalname, file.buffer, {
      access: 'public',
      token: process.env.VERCEL_BLOB_TOKEN,
    });

    const product = new Product({ name, description, price, color, size, stock, imageUrl: url });
    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Upload failed' });
  }
};