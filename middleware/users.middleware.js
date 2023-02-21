const joi = require('joi');

const userInfo = (req, res, next) => {
    const object = {
        email: joi.string().email().max(128).required()
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const register = (req, res, next) => {
    const object = {
        fullname: joi.string().max(128).required(),
        email: joi.string().email().max(128).required(),
        img: joi.string().required(),
        password: joi.string().max(128).optional()
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: 'Register is failed!', class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const login = (req, res, next) => {
    const object = {
        register_method: joi.number().min(0).max(1).optional(),
        email: joi.string().email().max(128).required(),
        captcha_token: joi.string().required(),
        password: joi.string().max(128).optional()
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const changePass = (req, res, next) => {
    const object = {
        email: joi.string().email().max(128).required(),
        oldpassword: joi.string().max(128).optional(),
        newpassword: joi.string().max(128).optional()
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const changePic = (req, res, next) => {
    const object = {
        email: joi.string().email().max(128).required(),
        img: joi.string().required(),
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const changeAddress = (req, res, next) => {
    const address = {
        province: joi.string().max(128).required(),
        name: joi.string().max(128).required(),
        city: joi.string().max(128).required(),
        district: joi.string().max(128).required(),
        detail: joi.string().max(256).required(),
        postal_code: joi.string().max(128).required(),
        phone: joi.string().max(16).required(),
    }

    const object = {
        email: joi.string().email().max(128).required(),
        default: joi.number().min(0).default(null),
        address: joi.array().items(address),
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

module.exports.userInfoValidations = userInfo;
module.exports.registerValidations = register;
module.exports.loginValidations = login;
module.exports.changePassValidations = changePass;
module.exports.changePicValidations = changePic;
module.exports.changeAddressValidations = changeAddress;