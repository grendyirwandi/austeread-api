'use strict';
const {} = require('../middleware/news.middleware');
const newsModel = require('../models/News_model');

class News {
    async getWordHighlightNews() {
        return await newsModel.getHighlight();
    }

    async getNewsHighlight() {
        return await newsModel.getHighlightForNews();
    }

    async updateHighlightNews(id, word_query) {
        return await newsModel.updateWordQueryHighlight(id, word_query);
    }
}

module.exports = new News();