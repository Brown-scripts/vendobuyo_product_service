const express = require('express');
const { createProduct, getProducts, getProductById, getSellerProducts, updateProduct, deleteProduct, getShopProducts,getSellerProductsByAdmin } = require('../controllers/productController');
const { authenticate, authenticateSellerOrAdmin, authenticateSeller } = require('../middleware/auth');
const { searchProducts } = require('../controllers/productController');

const router = express.Router();

router.post('/', authenticateSeller, createProduct);
router.get('/', authenticate, getProducts);
router.get('/seller', authenticate, getSellerProducts);
router.get('/shop/:shopId', authenticate, getShopProducts);
router.get('/product/:id', authenticate, getProductById);
router.put('/product/:id', authenticateSellerOrAdmin, updateProduct);
router.delete('/product/:id', authenticateSellerOrAdmin, deleteProduct);
router.get('/search',authenticate, searchProducts);
router.get('/seller/:sellerId', authenticateSellerOrAdmin, getSellerShopsByAdmin);


module.exports = router;