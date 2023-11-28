const User = require("../models/user");

const initialUsers = [
  {
    name: "Fabiolo Lopez",
    username: "mantras",
    password: "all12",
  },
  {
    name: "Alejandro Carmesi",
    username: "zubstack",
    password: "admin123",
  },
  {
    name: "Marco Mena",
    username: "mamen",
    password: "lozo123",
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

async function usersInDb() {
  const users = await User.find({});
  return users.map((item) => item.toJSON());
}

module.exports = { initialUsers, usersInDb, usersExamples };
