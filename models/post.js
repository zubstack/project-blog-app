const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
