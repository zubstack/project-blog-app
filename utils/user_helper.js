const bcrypt = require("bcrypt");

const User = require("../models/user");

const initialUsers = [
  {
    name: "Fabiolo Lopez",
    username: "mantras",
    password: "all12",
    passwordHash: "",
  },
  {
    name: "Alejandro Carmesi",
    username: "zubstack",
    password: "admin123",
    passwordHash: "",
  },
  {
    name: "Marco Mena",
    username: "mamen",
    password: "lozo123",
    passwordHash: "",
  },
];

const usersExamples = {
  good: {
    name: "Erick Silva",
    username: "e_sil",
    password: "delfo12",
  },
  bad: {
    name: "Bad document",
    username: "e_bad",
  },
};

initialUsers.map(async (user) => {
  const saltRounds = 10;
  user.passwordHash = await bcrypt.hash(user.password, saltRounds);
});

async function usersInDb() {
  const users = await User.find({});
  return users.map((item) => item.toJSON());
}

module.exports = { initialUsers, usersInDb, usersExamples };
