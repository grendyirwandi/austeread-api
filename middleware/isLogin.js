const Controller = require('../core/Controller')
// const winston    = require('../config/winston');

module.exports = async function (req, res, next) {
    try {
        if (req.session.login) {
            // console.log("asd");
            res.redirect("home")
        }else{
            req.session.errLogin = "You are not Login"
            res.redirect("auth")
        }
    } catch (ex) {
        // winston.warn(ex.message);
        req.session.destroy();
        res.redirect("auth")
    }
}