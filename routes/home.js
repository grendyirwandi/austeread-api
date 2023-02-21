'use strict';
const home = require('../controller/Home'),
verifyToken = require('../middleware/auth').verifyToken,
express = require('express'),
router = express.Router();

router.get('/getDashboard', verifyToken, (req, res) => {
    new home(req, res).getDashboard();
});
router.get('/users', verifyToken, async (req, res) => {
    await new home(req, res).users(req.params);
});
router.post('/users', verifyToken, async (req, res) => {
    await new home(req, res).addUsers(req.body);
});
router.put('/users/:id', verifyToken, async (req, res) => {
    await new home(req, res).updateUsers(req.body, req.params);
});
router.put('/cp-users/:id', verifyToken, async (req, res) => {
    await new home(req, res).cpUsers(req.body, req.params);
});
router.delete('/users/:id', verifyToken, async (req, res) => {
    await new home(req, res).delUsers(req.params);
});


router.get('/news', verifyToken, async (req, res) => {
    await new home(req, res).news(req.params);
});
router.post('/news', verifyToken, async (req, res) => {
    await new home(req, res).addNews(req.body);
});
router.put('/news/:id', verifyToken, async (req, res) => {
    await new home(req, res).updateNews(req.body, req.params);
});
router.delete('/news/:id', verifyToken, async (req, res) => {
    await new home(req, res).delNews(req.params);
});

router.get('/products-category', async (req, res) => {
    await new home(req, res).productsCategory();
});
router.post('/products-category', verifyToken, async (req, res) => {
    await new home(req, res).addProductsCategory(req.body);
});
router.put('/products-category/:id', verifyToken, async (req, res) => {
    await new home(req, res).upProductsCategory(req.body, req.params);
});
router.delete('/products-category/:id', verifyToken, async (req, res) => {
    await new home(req, res).delProductsCategory(req.params);
});

router.get('/products-subcategory', async (req, res) => {
    await new home(req, res).productsSubcategory();
});
router.post('/products-subcategory', verifyToken, async (req, res) => {
    await new home(req, res).addProductsSubcategory(req.body);
});
router.put('/products-subcategory/:id', verifyToken, async (req, res) => {
    await new home(req, res).upProductsSubcategory(req.body, req.params);
});
router.delete('/products-subcategory/:id', verifyToken, async (req, res) => {
    await new home(req, res).delProductsSubcategory(req.params);
});

router.post('/news-category', verifyToken, async (req, res) => {
    await new home(req, res).addNewsCategory(req.body);
});
router.put('/news-category/:id', verifyToken, async (req, res) => {
    await new home(req, res).upNewsCategory(req.body, req.params);
});
router.delete('/news-category/:id', verifyToken, async (req, res) => {
    await new home(req, res).delNewsCategory(req.params);
});


router.get('/config', async (req, res) => {
    await new home(req, res).getConfig();
});
router.put('/config', verifyToken, async (req, res) => {
    await new home(req, res).updateConfig(req.body);
});


router.get('/shopFooter/:id?', async (req, res) => {
    await new home(req, res).getShopFooter();
});
router.post('/shopFooter', verifyToken, async (req, res) => {
    await new home(req, res).addShopFooter();
});
router.put('/shopFooter/:id', verifyToken, async (req, res) => {
    await new home(req, res).upShopFooter();
});
router.delete('/shopFooter/:id',verifyToken, async (req, res) => {
    await new home(req, res).delShopFooter();
});


router.get('/questions', verifyToken, async (req, res) => {
    await new home(req, res).questions();
});


router.post('/questions', async (req, res) => {
    await new home(req, res).send_questions(req.body);
});

module.exports = router;