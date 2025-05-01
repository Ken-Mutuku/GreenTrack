const Product = require('../models/Product');

const createProduct = async (req, res, next) => {
  try {
    const productData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const product = new Product(productData);
    await product.save();

    // Add to user's owned products if applicable
    if (req.body.currentOwner) {
      await User.findByIdAndUpdate(
        req.body.currentOwner,
        { $addToSet: { ownedProducts: product._id } }
      );
    }

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username walletAddress')
      .populate('currentOwner', 'username walletAddress')
      .populate('updates.updatedBy', 'username walletAddress');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Add update to history
    product.updates.push({
      ...req.body,
      updatedBy: req.user.userId
    });

    // Update current status
    if (req.body.location) product.location = req.body.location;
    if (req.body.condition) product.condition = req.body.condition;
    if (req.body.currentOwner) {
      product.currentOwner = req.body.currentOwner;
      // Update ownership in blockchain would happen separately
    }

    await product.save();
    res.json(product);
  } catch (err) {
    next(err);
  }
};

const listProducts = async (req, res, next) => {
  try {
    const { role } = req.user;
    let query = {};

    // Farmers see their own products
    if (role === 'farmer') {
      query.createdBy = req.user.userId;
    }
    // Distributors/retailers see products assigned to them
    else if (role === 'distributor' || role === 'retailer') {
      query.currentOwner = req.user.userId;
    }
    // Consumers see products for sale
    else if (role === 'consumer') {
      query.forSale = true;
    }

    const products = await Product.find(query)
      .populate('createdBy', 'username')
      .populate('currentOwner', 'username');

    res.json(products);
  } catch (err) {
    next(err);
  }
};

module.exports = { createProduct, getProduct, updateProduct, listProducts };