const joi = require('joi');

const product = (req, res, next) => {
    const object = {
        productId: joi.date().timestamp('javascript').required(),
        productImg: joi.string().max(128).required(),
        productTitle: joi.string().max(128).required(),
        productPrice: joi.number().min(0).required(),
        productChoice: joi.string().max(128).required(),
        productWeight: joi.number().min(0).required(),
        productQty: joi.number().min(0).required(),
        total: joi.number().min(0).required(),
    }

    const schema = joi.object(object).required();

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const addCartWorkshop = (req, res, next) => {
    const object = {
        productId: joi.date().timestamp('javascript').required(),
        qty: joi.number().min(0).required()
    }

    const schema = joi.object(object).required();

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const addStockProduct = (req, res, next) => {
    const object = {
        productId: joi.date().timestamp('javascript').required(),
        productChoice: joi.string().required(),
        isAddStock: joi.boolean().required()
    }

    const schema = joi.object(object).required();

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const deleteProduct = (req, res, next) => {
    const object = {
        id_product: joi.string().required()
    }

    const schema = joi.object(object).required();

    const {error, value} = schema.validate(req.params);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.params = value;
    
    return next();
}

module.exports = { product, addCartWorkshop, addStockProduct, deleteProduct }