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
    default: 0,
    max: [100, "The value of likes cannot exceed 100."],
    min: [0, "The value of likes cannot be less than 0."],
  },
});

const Post = mongoose.model("Post", postSchema);

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Post;
