const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  createProduct,
  getProduct,
  updateProduct,
  listProducts
} = require('../controllers/productController');

router.post('/', auth, createProduct);
router.get('/', auth, listProducts);
router.get('/:id', auth, getProduct);
router.put('/:id', auth, updateProduct);

module.exports = router;