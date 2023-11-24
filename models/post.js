const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please set title"],
    unique: [true, "This title already exists"],
  },
  author: {
    type: String,
    required: [true, "Please set author"],
  },
  url: {
    type: String,
    required: [true, "Please set url"],
  },
  likes: {
    type: Number,
    min: [0, "Minimun of likes: 0"],
    max: [100, "Maximun of likes: 100"],
  },
});

const Post = mongoose.model("Post", postSchema);

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.likes = 0;
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Post;
