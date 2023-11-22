const express = require("express");
const Post = require("../models/post");

const router = express.Router();

router.get("/", async (request, response) => {
  const posts = await Post.find({});
  response.json(posts);
});

router.post("/", async (request, response) => {
  const { body } = request;
  const post = new Post(body);
  const result = await post.save();
  response.status(201).json(result);
});

module.exports = router;
