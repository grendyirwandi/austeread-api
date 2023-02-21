'use strict';
const home = require('../controller/RajaOngkir'),
express = require('express'),
router = express.Router();

router.get('/courier', (req, res) => {
    new home(req, res).courier();
});
router.get('/province', (req, res) => {
    new home(req, res).province();
});
router.get('/city', (req, res) => {
    new home(req, res).city(req.body);
});
router.get('/subdistrict', (req, res) => {
    new home(req, res).subdistrict(req.body);
});

router.post('/cost', async (req, res) => {
    await new home(req, res).cost(req.body);
});
router.post('/waybill', async (req, res) => {
    await new home(req, res).waybill(req.body);
});

module.exports = router;