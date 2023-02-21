require('express-async-errors');
const express = require('express');
const app     = express();

require("./startup/routes")(app);
require('./startup/config')();
require("./jobs/jobs.services");

module.exports = app;