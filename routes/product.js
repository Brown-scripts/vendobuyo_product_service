const express = require('express');
const { createProduct, getProducts, getProductById, getSellerProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, createProduct);
router.get('/', getProducts);
router.get('/seller', authenticate, getSellerProducts);
router.get('/:id', authenticate, getProductById);
router.put('/:id', authenticate, updateProduct);
router.delete('/:id', authenticate, deleteProduct);

module.exports = router;