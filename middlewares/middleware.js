/* eslint-disable no-undef */
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger.js");

function userExtractor(request, response, next) {
  if (!request.token) {
    return response.status(401).json({ error: "invalid token or unexisting" });
  }
  request.user = jwt.verify(request.token, process.env.SECRET);
  next();
}

function tokenExtractor(request, response, next) {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
}

function requestLogger(request, response, next) {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", filterSensitiveData(request));
  logger.info("---");
  next();
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }

  next(error);
};

// Helpers

const filterSensitiveData = (request) => {
  if (request.body && request.body.password) {
    const bodyCopy = { ...request.body };
    bodyCopy.password = "********";
    return bodyCopy;
  } else {
    return request.body;
  }
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
