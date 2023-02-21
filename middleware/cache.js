const {GETREDIS} = require('../models/Redis');
const Controller = require('../core/Controller');

async function cacheMenu(req, res, next) {
    const data   = JSON.parse(await GETREDIS('MenuByCategory'));
    const controller = new Controller(res);
    const token      = await controller._model('Login_model').createToken(req.user.username, req.user.person_id);
    if (data != null) {
        controller.responseHeader(token, 200, 'Success', data);
    } else {
        next();
    }
}

module.exports.cacheMenu = cacheMenu;