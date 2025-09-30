const Product = require('../models/Product');
const { BlobServiceClient } = require('@azure/storage-blob');

exports.addProduct = async (req, res) => {
  const { name, description, price, color, size, stock } = req.body;
  try {
    const product = new Product({ name, description, price, color, size, stock });
    if (req.file) {
      const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.VERCEL_BLOB_TOKEN);
      const containerClient = blobServiceClient.getContainerClient('images');
      const blobName = `${Date.now()}-${req.file.originalname}`;
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      await blockBlobClient.upload(req.file.buffer, req.file.size);
      product.imageUrl = blockBlobClient.url;
    }
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ msg: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};