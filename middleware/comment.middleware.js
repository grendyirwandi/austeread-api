const joi = require('joi');

const comment = (req, res, next) => {
    const object = {
        id_news: joi.date().timestamp('javascript').required(),
        id_parrent_comment: joi.date().timestamp('javascript'),
        comment: joi.string().required(),
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

const replyComment = (req, res, next) => {
    const object = {
        id_parrent_comment: joi.date().timestamp('javascript').required(),
        page: joi.number().min(1).default(1),
        limit: joi.number().min(1).max(10).default(6)
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.query);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});
    
    value.id_parrent_comment = req.query.id_parrent_comment;
    req.query = value;

    return next();
}

const like = (req, res, next) => {
    const object = {
        idComment: joi.date().timestamp('javascript').required(),
        isLike: joi.boolean().required(),
    }

    const schema = joi.object(object);
    const {error, value} = schema.validate(req.body);

    if (error) return res.status(400).json({status: 'Failed', message: error.message, class: 'alert alert-danger alert-dismissible fade show'});

    return next();
}

module.exports.likeValidations = like;
module.exports.commentValidations = comment;
module.exports.replyCommentValidations = replyComment;