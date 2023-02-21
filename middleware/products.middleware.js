const joi = require('joi');

const productById = (req, res, next) => {
    const object = {
        id: joi.date().timestamp('javascript').required(),
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.params);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});
    
    value.id = req.params.id;
    req.params = value;

    return next();
}

const products = (req, res, next) => {
    const object = {
        search: joi.string().max(256).default(""),
        subcat: joi.string().max(256).default(""),
        page: joi.number().min(0).default(1),
        limit: joi.number().min(0).max(10).default(6),
        isPopular : joi.boolean().default(false),
        isWorkshop :  joi.boolean().default(false)
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.query);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});
    
    req.query = value;

    return next();
}

const addProducts = (req, res, next) => {
    if (req.body['product_type_id'] != 1 && req.body['product_type_id'] != 2) return res.status(400).json({status: 'Failed', message: "FAILED, BAD REQUEST", class: 'alert alert-danger alert-dismissible fade show'});

    const choiceItem = {
        "name": joi.string().required(),
        "stock": joi.number().min(1).required(),
        "weight": joi.number().min(0).required(),
        "price": joi.number().min(1).required()
    }

    const workshop_detail = {
        "startDate": joi.date().required(),
        "endDate": joi.date().required(),
        "location": joi.string().required(),
        "price": joi.number().min(1).required(),
        "qty": joi.number().min(1).required()
    }

    const object = {
        "name": joi.string().max(125).required(),
        "img": joi.array().items(joi.string().max(125)).required(),
        "subcategory_id": joi.string().max(125).required(),
        "desc": joi.string().required(),
        "detail": joi.string().required(),
        "size_chart": joi.string().default(null),
        "creator": joi.number().min(1).required(),
        "product_type_id" : joi.number().valid(1,2).required()
    }

    if (req.body['product_type_id'] == 1) {
        object['choice'] = joi.array().items(choiceItem).default(null)
    } else {
        object['workshop_detail'] = joi.object(workshop_detail).default(null)
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.body = value;

    return next();
}

module.exports.productByIdValidations = productById;
module.exports.productsValidations = products;
module.exports.addProductsValidations = addProducts;