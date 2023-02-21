'use strict';
const login = require('../controller/Login'),
verifyToken = require('../middleware/auth').verifyToken,
 express = require('express'),
 router = express.Router();

const {userInfoValidations, registerValidations, loginValidations, changePassValidations, changePicValidations, changeAddressValidations} = require("../middleware/users.middleware");

router.post('/auth', loginValidations, async (req, res) => {
    await new login(req, res).auth();
});

router.post('/login', loginValidations, async (req, res) => {
    await new login(req, res).login();
});

router.post('/userInfo', verifyToken, userInfoValidations, async (req, res) => {
    await new login(req, res).userInfo();
});

router.post('/register', registerValidations, async (req, res) => {
    await new login(req, res).register(req.body);
});

router.put('/cpass-person', verifyToken, changePassValidations, async (req, res) => {
    await new login(req, res).changePassPerson(req.body);
});

router.put('/cpic-person', verifyToken, changePicValidations, async (req, res) => {
    await new login(req, res).changePicPerson(req.body);
});

router.put('/caddress-person', verifyToken, changeAddressValidations, async (req, res) => {
    await new login(req, res).changeAddressPerson();
});

router.get('/discount_code/:id?', async (req, res) => {
    await new login(req, res).discountCode();
});
router.post('/discount_code', async (req, res) => {
    await new login(req, res).addDiscountCode();
});
router.put('/discount_code/:id', verifyToken, async (req, res) => {
    await new login(req, res).updateDiscountCode();
});
router.delete('/discount_code/:id', verifyToken, async (req, res) => {
    await new login(req, res).delDiscountCode();
});

module.exports = router;