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

router.delete("/:id", async (request, response) => {
  const { id } = request.params;
  const result = await Post.findByIdAndDelete(id);
  if (!result) {
    response.status(404).json({ error: "document not found" });
  } else {
    response.status(201).json({ deleted: result });
  }
});

router.put("/:id", async (request, response) => {
  const { body } = request;
  const { id } = request.params;

  const updatedPost = await Post.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!updatedPost) {
    response.status(404).json({ error: "document not found" });
  } else {
    response.status(201).json({ updated: updatedPost });
  }
});

module.exports = router;
