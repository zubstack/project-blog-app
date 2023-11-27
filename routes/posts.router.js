const express = require("express");
const jwt = require("jsonwebtoken");
const Post = require("../models/post");
const User = require("../models/user");

const router = express.Router();

function getTokenFrom(request) {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
}

router.get("/", async (request, response) => {
  const posts = await Post.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  response.json(posts);
});

router.post("/", async (request, response) => {
  const { title, author, url } = request.body;
  const decodedToken = jwt.verify(getTokenFrom(request), "my_secret");
  const { id } = decodedToken;
  if (!id) {
    return response.status(401).json({ error: "invalid token" });
  }
  const user = await User.findById(id);
  const newPost = new Post({ title, author, url, user: id });
  const savedPost = await newPost.save();

  user.posts = user.posts.concat(newPost._id);
  await user.save();

  console.log("token", decodedToken);
  response.json(savedPost);
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
