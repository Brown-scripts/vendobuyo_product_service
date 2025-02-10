const express = require('express');
const { createShop, getShops, getShopById, getSellerShops, updateShop, deleteShop,getSellerShopsByAdmin } = require('../controllers/productController');
const { authenticate, authenticateSellerOrAdmin, authenticateSeller } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateSeller, createShop);
router.get('/', authenticate, getShops);
router.get('/seller', authenticateSeller, getSellerShops);
router.get('/shop/:id', authenticate, getShopById);
router.put('/shop/:id', authenticateSellerOrAdmin, updateShop);
router.delete('/shop/:id', authenticateSellerOrAdmin, deleteShop);
router.get('/seller/:sellerId', authenticateSellerOrAdmin, getSellerShopsByAdmin);

module.exports = router;