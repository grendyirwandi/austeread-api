'use strict';
const products = require('../controller/Products');
const verifyToken = require('../middleware/auth').verifyToken;
const {
    productByIdValidations,
    productsValidations, addProductsValidations
} = require('../middleware/products.middleware');
const router = require('express').Router();

router.get('/products', productsValidations, async (req, res) => {
    const dataProducts = await products.get(req.query.search, req.query.subcat, req.query.page, req.query.limit, req.query.isPopular, req.query.isWorkshop);

    const response = {
        success: dataProducts.count != 0 ? true : false,
        message: dataProducts.count != 0 ? "Product data found!" : "Product data not found!",
        data: dataProducts.count != 0 ? dataProducts : null
    }

    return res.json(response);
});

router.get('/products/:id', productByIdValidations, async (req, res) => {
    const dataProduct = await products.getProductById(req.params.id);

    const response = {
        success: dataProduct != null ? true : false,
        message: dataProduct != null ? "Product data found!" : "Product data not found!",
        data: dataProduct
    }

    return res.json(response);
});

router.post('/products', verifyToken, addProductsValidations, async (req, res) => {
    const dataProduct = await products.addProducts(req.body);
    return res.json(dataProduct);
});

router.put('/products/:id', verifyToken, async (req, res) => {
    const dataProduct = await products.updateProducts(req.body, req.params);
    return res.json(dataProduct);
});

router.delete('/products/:id', verifyToken, async (req, res) => {
    const dataProduct = await products.delProducts(req.params);
    return res.json(dataProduct);
});


router.get('/productsShop', async (req, res) => {
    const dataProduct = await products.getProductForShop();

    return res.json(dataProduct);
});

module.exports = router;