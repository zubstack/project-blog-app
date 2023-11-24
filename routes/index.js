const postsRouter = require("./posts.router.js");
const usersRouter = require("./users.router.js");
const express = require("express");

function routerApi(app) {
  const router = express.Router();
  app.use("/api", router);
  router.use("/posts", postsRouter);
  router.use("/users", usersRouter);
}

module.exports = routerApi;
