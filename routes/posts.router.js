const express = require("express");
const Blog = require("../models/post");

const router = express.Router();

router.get("/", (request, response) => {
  Blog.find({}).then((posts) => {
    response.json(posts);
  });
});

router.post("/", (request, response) => {
  const blog = new Blog(request.body);
  blog.save().then((result) => {
    response.status(201).json(result);
  });
});

module.exports = router;
