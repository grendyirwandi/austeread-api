'use strict';
const comment = require('../controller/Comment');
const {commentValidations, likeValidations, replyCommentValidations} = require('../middleware/comment.middleware');
const verifyToken = require('../middleware/auth').verifyToken;
const router = require('express').Router();

router.get('/comment/:id_news', async (req, res) => {
    const dataComment = await comment.getComment(req.params);

    const response = {
        success: dataComment != null && dataComment.length != 0 ? true : false,
        message: dataComment != null && dataComment.length != 0 ? "Comment data found!" : "Comment data not found!",
        data: dataComment != null && dataComment.length != 0 ? dataComment : null
    }

    return res.json(response);
});

router.get('/replysComment', replyCommentValidations, async (req, res) => {
    const dataComment = await comment.getReplyComment(req.query.id_parrent_comment, req.query.page, req.query.limit);

    const response = {
        success: dataComment.count != 0 ? true : false,
        message: dataComment.count != 0 ? "Comment data found!" : "Comment data not found!",
        data: dataComment.count != 0 ? dataComment : null
    }

    return res.json(response);
});

router.post('/comment', verifyToken, commentValidations, async (req, res) => {
    const dataComment = await comment.addComment(req.user.id, req.body.id_news, req.body.comment, req.body.id_parrent_comment);
    
    const response = {
        success: dataComment.status === 'Success' ? true : false,
        message: dataComment.message,
        data: {
            class: dataComment.class
        }
    }

    return res.json(response);
});

router.post('/likeComment', verifyToken, likeValidations, async (req, res) => {
    await comment.likeComment(req.user.id, req.body.idComment, req.body.isLike);

    const response = {
        success: true, 
        message: "like comment successfully!"
    }

    return res.json(response);
});

module.exports = router;