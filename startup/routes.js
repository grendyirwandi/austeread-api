"use strict";
const { notFound, error } = require("../middleware/error");
const routesHandler = require("../middleware/routesHandler");

// const winston = require('../config/winston');

const moment = require("moment");
const path = require("path");
const express = require("express");
// const cookieParser = require('cookie-parser');
const session = require("express-session");
const morgan = require("morgan");
const cors = require("cors");
const cartRoutes = require("../routes/cart");
const commentRoutes = require("../routes/comment");
const homeRoutes = require("../routes/home");
const indexRoutes = require("../routes/index");
const loginRoutes = require("../routes/login");
const newsRoutes = require("../routes/news");
const notificationsRoutes = require("../routes/notifications");
const orderRoutes = require("../routes/order");
const productsRoutes = require("../routes/products");
const rajaOngkirRoutes = require("../routes/rajaongkir");

module.exports = function (app) {
  app.use(
    session({
      secret: "M1r34cl3",
      resave: true,
      saveUninitialized: true,
      cookie: { maxAge: 3600000 * 3 },
    })
  );
  app.use("/assets", express.static(path.join(__dirname, "/../assets")));
  // view engine setup
  app.set("views", path.join(__dirname, "/../views"));
  app.set("view engine", "pug");

  morgan.token("date", () => {
    return moment().utcOffset("+0700").format();
  });

  // app.use(morgan('combined', { stream: winston.stream }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" }));
  var allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:4021",
    "https://austeread-shop.grendy.dev",
    "https://austeread.grendy.dev",

    "http://149.102.136.93:4021",
    "http://149.102.136.93:4022",
    "http://149.102.136.93:3000",

    "https://austin.grendy.dev",
    "https://austin-shop.grendy.dev",
  ];
  app.use(
    cors({
      credentials: true,
      origin: function (origin, callback) {
        // (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          var msg =
            "The CORS policy for this site does not " +
            "allow access from the specified Origin.";
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      },
    })
  );
  // app.use(cookieParser());

  // routes handler
  // app.use(routesHandler);

  app.use("/api/", cartRoutes);
  app.use("/api/", commentRoutes);
  app.use("/api/", homeRoutes);
  app.use("/api/", indexRoutes);
  app.use("/api/", loginRoutes);
  app.use("/api/", newsRoutes);
  app.use("/api/", notificationsRoutes);
  app.use("/api/", orderRoutes);
  app.use("/api/", productsRoutes);
  app.use("/api/", rajaOngkirRoutes);

  // catch 404 and forward to error handler
  app.use(notFound);

  // error handler
  app.use(error);
};
