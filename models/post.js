const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    type: Array,
    default: [],
    min: [0, "The value of likes cannot be less than 0."],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Each post must to specify its creator"],
  },
});

postSchema.plugin(uniqueValidator);

const Post = mongoose.model("Post", postSchema);

postSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = Post;
