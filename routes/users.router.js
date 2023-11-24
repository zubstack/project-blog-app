const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();

router.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

router.post("/", async (request, response) => {
  const { name, username, password } = request.body;
  if (username.length < 3 || password.length < 3) {
    return response.status(401).json({
      error: "Both username and password must to have a least 3 characters",
    });
  }
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ name, username, passwordHash });
  const result = await user.save();
  response.status(201).json(result);
});

// router.delete("/:id", async (request, response) => {
//   const { id } = request.params;
//   const result = await User.findByIdAndDelete(id);
//   if (!result) {
//     response.status(404).json({ error: "document not found" });
//   } else {
//     response.status(201).json({ deleted: result });
//   }
// });

// router.put("/:id", async (request, response) => {
//   const { body } = request;
//   const { id } = request.params;

//   const updatedUser = await User.findByIdAndUpdate(id, body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!updatedUser) {
//     response.status(404).json({ error: "document not found" });
//   } else {
//     response.status(201).json({ updated: updatedUser });
//   }
// });

module.exports = router;
