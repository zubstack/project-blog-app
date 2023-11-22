const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routerApi = require("./routes");
const requestLogger = require("./middlewares/logger.request");

// const postSchema = new mongoose.Schema({
//   title: String,
//   author: String,
//   url: String,
//   likes: Number,
// });

// const Blog = mongoose.model("Post", postSchema);

const mongoUrl =
  "mongodb+srv://lobato:loto123@cluster0.5hhi0xd.mongodb.net/blog?retryWrites=true&w=majority";
mongoose.connect(mongoUrl).then(() => console.log("Connected to database"));

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("Welcome to blog API");
});

routerApi(app);

app.get("/*", (request, response) => {
  response.send("Not found");
});

module.exports = app;
