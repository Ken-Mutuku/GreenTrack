const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const {
  getContract,
  getProductFromBlockchain
} = require('../controllers/blockchainController');

router.get('/contract', auth, getContract);
router.get('/products/:id', auth, getProductFromBlockchain);

module.exports = router;