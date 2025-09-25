const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/users', authMiddleware, adminMiddleware, adminController.getUsers);
router.put('/users/:userId', authMiddleware, adminMiddleware, adminController.updateUser);
router.delete('/users/:userId', authMiddleware, adminMiddleware, adminController.deleteUser);
router.get('/orders', authMiddleware, adminMiddleware, adminController.getOrders);
router.put('/orders/:orderId', authMiddleware, adminMiddleware, adminController.updateOrderStatus);

module.exports = router;