'use strict';
const verifyToken = require('../middleware/auth').verifyToken;
const orderController = require('../controller/Order');
const getOrderValidation = require('../middleware/order.middleware').getOrder;
const addOrderValidation = require('../middleware/order.middleware').addOrder;
const express = require('express');
const router = express.Router();

router.get('/order', verifyToken, getOrderValidation, async (req, res) => {
    return await new orderController(req, res).getOrder();
});

router.post('/order', verifyToken, addOrderValidation, async (req, res) => {
    return await new orderController(req, res).insertOrder();
});

router.put('/order/:id', verifyToken, async (req, res) => {
    return await new orderController(req, res).updateOrder();
});

module.exports = router;