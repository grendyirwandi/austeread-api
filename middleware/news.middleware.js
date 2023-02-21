const joi = require('joi');
const { min } = require('lodash');

const category = (req, res, next) => {
    const object = {
        category: joi.string().max(128).required(),
        search: joi.string().max(128),
        page: joi.number().min(1).required(),
        limit: joi.number().min(1).max(10).default(6),
        date: joi.date()
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.query);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    if (req.query.date) value.date = req.query.date;
    req.query = value;

    return next();
}

const subNews = (req, res, next) => {
    const object = {
        subNews: joi.array().items(joi.number()).required(),
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.body = value;

    return next();
}

const like = (req, res, next) => {
    const object = {
        idNews: joi.number().min(0).required(),
        isLike: joi.number().valid(0,1).required(),
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.body = value;

    return next();
}

const highlight = (req, res, next) => {
    const object = {
        id: joi.number().min(1).max(3).required(),
        word_query: joi.string().max(75).required(),
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    req.body = value;

    return next();
}

module.exports.categoryValidations = category;
module.exports.subNewsValidations = subNews;
module.exports.likeValidations = like;
module.exports.highlightValidations = highlight;