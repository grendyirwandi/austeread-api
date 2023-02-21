'use strict';
const cartController = require('../controller/Cart');
const verifyToken = require('../middleware/auth').verifyToken;
const productValidation = require('../middleware/cart.middleware').product;
const addStockProductValidation = require('../middleware/cart.middleware').addStockProduct;
const addCartWorkshop = require('../middleware/cart.middleware').addCartWorkshop;
const deleteProduct = require('../middleware/cart.middleware').deleteProduct;
const express = require('express');
const router = express.Router();

router.get('/cart', verifyToken, async (req, res) => {
    const dataCart = await cartController.get(req.user.id);
    
    const response = {
        success: dataCart != null ? true : false, 
        message: dataCart != null ? "Cart data found!" : "Cart data not found!", 
        data: dataCart
    }

    return res.json(response);
});

router.post('/cart', verifyToken, productValidation, async (req, res) => {
    await cartController.post(req.user.id, req.body);
    
    const response = {
        success: true, 
        message: "Cart data has been updated successfully!"
    }

    return res.json(response);
});

router.put('/cart', verifyToken, addStockProductValidation, async (req, res) => {
    await cartController.put(req.user.id, req.body.productId, req.body.productChoice, req.body.isAddStock);

    const response = {
        success: true, 
        message: "Product stock added successfully!"
    }

    return res.json(response);
});

router.delete('/cart', verifyToken, async (req, res) => {
    await cartController.delete(req.user.id, req.body.productId);
    
    const response = {
        success: true, 
        message: "Cart data has been cleaned successfully!"
    }

    return res.json(response);
});

router.get('/cart/workshop', verifyToken, async (req, res) => {
    const dataCart = await cartController.get(req.user.id, true);
    
    const response = {
        success: dataCart != null ? true : false, 
        message: dataCart != null ? "Cart data found!" : "Cart data not found!", 
        data: dataCart
    }

    return res.json(response);
});

router.post('/cart/workshop', verifyToken, addCartWorkshop, async (req, res) => {
    await cartController.post(req.user.id, req.body, true);
    
    const response = {
        success: true, 
        message: "Cart data has been added successfully!"
    }

    return res.json(response);
});

router.patch('/cart/workshop', verifyToken, addCartWorkshop, async (req, res) => {
    await cartController.patchQtyWorkshop(req.user.id, req.body.productId, req.body.qty);

    const response = {
        success: true, 
        message: "Product stock updated successfully!"
    }

    return res.json(response);
});

router.delete('/cart/workshop/:id_product', verifyToken, deleteProduct, async (req, res) => {
    await cartController.deleteProductFromCartWorkshop(req.user.id, req.params.id_product);

    const response = {
        success: true, 
        message: "Cart data has been cleaned successfully!"
    }

    return res.json(response);
});

module.exports = router;