'use strict';
const commentModel = require('../models/Comments_model');

class Comment {
    async getComment(params) {
        let comment = await commentModel.getComment(params.id_news);
        return comment;
    }

    async getReplyComment(id_parrent_comment, page=1, limit=6) {
        return await commentModel.getReplyComment(id_parrent_comment, page, limit);
    }

    async addComment(id_person, id_news, comment, id_parrent_comment = null) {
        try {
            await commentModel.insertComment(id_person, id_news, comment, id_parrent_comment)
            return {
                status: 'Success',
                message: 'Comment is successfull added!',
                class: 'alert alert-success alert-dismissible fade show'
            };
        } catch (err) {
            console.log('err', err);
            return {
                status: 'Failed',
                message: 'Comment is failed added!',
                class: 'alert alert-danger alert-dismissible fade show'
            };
        }
    }

    async likeComment(idPerson, idComment, isLike) {
        try {
            await commentModel.likeComment(idPerson, idComment, isLike);
            return true;
        } catch (error) {
            console.log(error)
            return true;
        }
    }
}

module.exports = new Comment();