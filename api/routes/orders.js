const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');

router.get('/', checkAuth, OrdersController.order_get__all);

router.post('/', checkAuth, OrdersController.order_create_order);

// Indywidualne zamówienia

router.get('/:orderID', checkAuth, OrdersController.order_get_order);

router.patch('/:orderID', checkAuth, OrdersController.order_patch_order);

router.delete('/:orderID', checkAuth, OrdersController.order_delete_order);

module.exports = router;