'use strict';
const notifications = require('../controller/Notifications'),
verifyToken = require('../middleware/auth').verifyToken,
 express = require('express'),
 router = express.Router();

const emailValidation = require('../middleware/notifications.middleware').email

router.post('/sendMail', verifyToken, emailValidation, async (req, res) => {
    await new notifications(req, res).sendEmail(req.body);
    return res.json({status: 'Success', message: 'Email sent successfully!', class: 'alert alert-success alert-dismissible fade show'});
});

module.exports = router;