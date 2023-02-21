const joi = require('joi');

const email = (req, res, next) => {
    const object = {
        sender: joi.string().email().valid('noreply@austeread.com', 'shop@austeread.com').max(128).required(),
        recipient: joi.string().email().max(128).required(),
        subject: joi.string().max(128).required(),
        contents: joi.string().required()
    }

    const schema = joi.object(object);

    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

module.exports = { email }