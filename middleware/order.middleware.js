const joi = require('joi');

const getOrder = (req, res, next) => {
    const object = {
        id: joi.string().default(null),
        is_workshop: joi.bool().default(false)
    }

    const schema = joi.object(object).required();

    const {error, value} = schema.validate(req.query);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.query = value;
    
    return next();
}

const addOrder = (req, res, next) => {
    const orderItem = {
        "productId": joi.string().required(),
        "productImg": joi.string().required(),
        "productTitle": joi.string().required(),
        "productPrice": joi.number().min(0).required(),
        "productChoice": joi.string(),
        "productQty": joi.number().required(),
        "total": joi.number().required()
    }
    let object;

    if (req.body.is_workshop == true) {
        object = {
            id_person: joi.string().required(),
            order: joi.array().items(orderItem).required(),
            name: joi.string().required(),
            is_workshop: joi.bool().required(),
            detail_address: joi.string(),
            province: joi.number().min(0),
            city: joi.number().min(0),
            district: joi.number().min(0),
            postal_code: joi.number().min(0),
            courier: joi.string(),
            service: joi.string(),
            phone: joi.string(),
            discount_price: joi.number().min(0),
            shipping_price: joi.number().min(0),
            total: joi.number().min(0).required()
        }
    } else  {
        object = {
            id_person: joi.string().required(),
            order: joi.object().required(),
            name: joi.string().required(),
            is_workshop: joi.bool().required(),
            detail_address: joi.string(),
            province: joi.number().min(0),
            city: joi.number().min(0),
            district: joi.number().min(0),
            postal_code: joi.number().min(0),
            courier: joi.string(),
            service: joi.string(),
            phone: joi.string(),
            discount_price: joi.number().min(0),
            shipping_price: joi.number().min(0),
            total: joi.number().min(0).required()
        }
    }


    const schema = joi.object(object).required();

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.body = value;
    
    return next();
}

module.exports = { getOrder, addOrder }