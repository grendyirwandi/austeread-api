"use strict";

class Controller {
    constructor(res) {
        this.res = res;
    }

    response (code, message = null, results = null) {
        this.res.status(code).json({"status":(code < 400 ? 'Ok' : 'Error'),"code":code,"message":message, "result":results});
    }

    responseHeader (token, code, message = null, results = null) {
        this.res.header('x-auth-token', token).status(code).json({"status":(code < 400 ? 'Ok' : 'Error'),"code":code,"message":message, "result":results});
    }

    render (path, data) {
        this.res.render(path, data);
    }

    _model(model){
        const classModel = require('../models/'+model)
        return new classModel
    }

    _sleep(ms){
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

module.exports = Controller;