'use strict';
const index = require('../controller/Index'),
verifyToken = require('../middleware/auth').verifyToken,
express = require('express'),
router = express.Router();
const { categoryValidations, subNewsValidations, likeValidations } = require('../middleware/news.middleware');

router.get('/getNews', (req, res) => {
    new index(req, res).getNews();
});

router.get('/getNews/:id', (req, res) => {
    new index(req, res).getNewsById(req.params);
});

router.get('/getNewsByCategory', categoryValidations, (req, res) => {
    new index(req, res).getAllNewsByCategory(req.query);
});

router.get('/getLatestNews', (req, res) => {
    new index(req, res).getLatestNews();
});

router.get('/getAllCategory', (req, res) => {
    new index(req, res).getAllCategory();
});

router.get('/getSearchNews/:search', (req, res) => {
    new index(req, res).getSearchNews(req.params);
});

router.get('/getLikeNewsByPerson/:idNews', verifyToken, (req, res) => {
    new index(req, res).getLikeNewsByPerson(req.params.idNews, req.user.id);
});

router.put('/likeNews', verifyToken, likeValidations, (req, res) => {
    new index(req, res).likeNews(req.body.isLike, req.body.idNews, req.user.id);
});

router.get('/subNews', verifyToken, (req, res) => {
    new index(req, res).getSubNews(req.user);
});

router.put('/subNews', verifyToken, subNewsValidations, (req, res) => {
    new index(req, res).updateSubNews(req.body.subNews, req.user.id);
});


module.exports = router;