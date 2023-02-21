const Controller  = require('../core/Controller')
// const winston     = require('../config/winston');
const createError = require('http-errors');

module.exports.notFound = function(req, res, next) {
    next(createError(404));
};

module.exports.error = function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    const respon = new Controller(res);
    
    // winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    // render the error page
    respon.response((err.status || 500), err.message);
};