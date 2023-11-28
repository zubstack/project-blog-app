require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routerApi = require("./routes");
const { MONGODB_URI } = require("./utils/config");
const middlewares = require("./middlewares/middleware");
const logger = require("./utils/logger");

mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info("Connected to database"))
  .catch((error) =>
    logger.error("error connecting to MongoDB:", error.message)
  );

app.use(cors());
app.use(express.json());
app.use(middlewares.requestLogger);
app.use(middlewares.tokenExtractor);

app.get("/", (request, response) => {
  response.send("Welcome to blog API");
});

routerApi(app);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;
