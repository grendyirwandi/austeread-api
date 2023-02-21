module.exports = function (req, res, next) {
  // const allowedOrigins = [
  //   "http://localhost:3000",
  //   "http://localhost:4021",
  //   "https://austeread-shop.grendy.dev",
  //   "https://austeread.grendy.dev",
    
  //   "http://149.102.136.93:4021",
  //   "http://149.102.136.93:4022",
  //   "http://149.102.136.93:3000",
    
  //   "https://austin.grendy.dev",
  //   "https://austin-shop.grendy.dev",
  // ];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  // }
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token, Authorization, RBR"
  );
  res.header("Access-Control-Expose-Headers", "x-auth-token");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
};