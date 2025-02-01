const express = require('express');
const { createProduct, getProducts, getProductById, getSellerProducts, updateProduct, deleteProduct, getShopProducts } = require('../controllers/productController');
const { authenticate, authenticateSellerOrAdmin, authenticateSeller } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateSeller, createProduct);
router.get('/', authenticate, getProducts);
router.get('/seller', authenticate, getSellerProducts);
router.get('/shop/:shopId', authenticate, getShopProducts);
router.get('/product/:id', authenticate, getProductById);
router.put('/product/:id', authenticateSellerOrAdmin, updateProduct);
router.delete('product/:id', authenticateSellerOrAdmin, deleteProduct);

module.exports = router;