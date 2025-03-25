const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Add new product
router.post('/add', async (req, res) => {
  const { name, description, price, quantity } = req.body;
  const newProduct = new Product({ name, description, price, quantity, seller: req.user._id });
  await newProduct.save();
  res.redirect('/dashboard');
});

// Edit product
router.post('/edit/:id', async (req, res) => {
  const { name, description, price, quantity } = req.body;
  await Product.findByIdAndUpdate(req.params.id, { name, description, price, quantity });
  res.redirect('/dashboard');
});

// Delete product
router.post('/delete/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.redirect('/dashboard');
});

module.exports = router;
