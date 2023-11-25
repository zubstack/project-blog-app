const express = require("express");
const Post = require("../models/post");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (request, response) => {
  const posts = await Post.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(posts);
});

router.post("/", async (request, response) => {
  const { title, author, url, userId } = request.body;
  const user = await User.findById(userId);
  if (!user) {
    return response.status(404).json({ error: "user not found" });
  }
  const newPost = new Post({ title, author, url, user: user.id });
  const result = await newPost.save();

  user.posts = user.posts.concat(newPost._id);
  await user.save();
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
