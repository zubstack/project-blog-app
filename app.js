const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routerApi = require("./routes");
const requestLogger = require("./middlewares/logger.request");
const { MONGODB_URI } = require("./utils/config");

mongoose.connect(MONGODB_URI).then(() => console.log("Connected to database"));

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
