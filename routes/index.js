const postsRouter = require("./posts.router.js");
const express = require("express");

function routerApi(app) {
  const router = express.Router();
  app.use("/api", router);
  router.use("/posts", postsRouter);
}

module.exports = routerApi;
