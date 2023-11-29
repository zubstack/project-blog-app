const express = require("express");

const Post = require("../models/post");
const User = require("../models/user");
const middlewares = require("../middlewares/middleware");
const router = express.Router();

router.get("/", async (request, response) => {
  const posts = await Post.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(posts);
});

router.post("/", middlewares.userExtractor, async (request, response) => {
  const { title, author, url } = request.body;

  if (!(title && author && url)) {
    return response.status(400).json({ error: "missing data" });
  }

  const { id } = request.user;
  const user = await User.findById(id);
  const newPost = new Post({ title, author, url, user: id });
  const savedPost = await newPost.save();

  user.posts = user.posts.concat(newPost._id);
  await user.save();

  response.status(201).json({ created: savedPost });
});

router.delete("/:id", middlewares.userExtractor, async (request, response) => {
  const { id: postId } = request.params;
  if (!postId) {
    return response.status(400).json({ error: "missing id" });
  }

  const { id: userId } = request.user;
  const user = await User.findById(userId);
  const postToDelete = await Post.findById(postId);
  if (!postToDelete) {
    return response.status(404).json({ error: "document not found" });
  }
  if (user.id !== postToDelete.user.toString()) {
    return response
      .status(401)
      .json({ error: "creator is the only allowed to delete their posts" });
  }
  const result = await Post.findByIdAndDelete(postId);
  response.status(201).json({ deleted: result });
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
