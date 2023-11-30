const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const router = express.Router();

router.post("/", async (request, response) => {
  const { username, password } = request.body;
  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(password.toString(), user.passwordHash);

  if (!(user && passwordCorrect)) {
    return response
      .status(401)
      .json({ message: "Invalid username or password" });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  };

  // eslint-disable-next-line no-undef
  const token = jwt.sign(userForToken, process.env.SECRET);

  response.status(200).json({
    username: user.username,
    name: user.name,
    token,
  });
});

module.exports = router;
