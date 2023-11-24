const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please set username"],
    unique: [true, "This username already exists"],
  },
  name: {
    type: String,
    required: [true, "Please set name"],
  },
  passwordHash: String,
});

const User = mongoose.model("User", usersSchema);

usersSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = User;
