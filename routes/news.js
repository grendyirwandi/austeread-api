'use strict';
const news = require('../controller/News');
const verifyToken = require('../middleware/auth').verifyToken;
const {highlightValidations} = require('../middleware/news.middleware');
const router = require('express').Router();

router.get('/news/highlight', async (req, res) => {
    const data = await news.getNewsHighlight();

    const response = {
        success: data != null && data.length != 0 ? true : false,
        message: data != null && data.length != 0 ? "Highlight data found!" : "Highlight data not found!",
        data: data != null && data.length != 0 ? data : null
    }

    return res.json(response);
});

router.get('/hightlightNews', verifyToken, async (req, res) => {
    const data = await news.getWordHighlightNews();

    const response = {
        success: data != null && data.length != 0 ? true : false,
        message: data != null && data.length != 0 ? "Highlight data found!" : "Highlight data not found!",
        data: data != null && data.length != 0 ? data : null
    }

    return res.json(response);
});

router.put('/hightlightNews', verifyToken, highlightValidations, async (req, res) => {
    const data = await news.updateHighlightNews(req.body.id, req.body.word_query);

    const response = {
        success: true, 
        message: "Update data successfully!"
    }

    return res.json(response);
});

module.exports = router;