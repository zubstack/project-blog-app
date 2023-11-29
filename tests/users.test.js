const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const helper = require("../utils/user_helper");
const User = require("../models/user");

const api = request(app);
const endpoint = "/api/users";

beforeEach(async () => {
  await User.deleteMany({});
  const usersObject = helper.initialUsers.map((item) => new User(item));
  const promiseArray = usersObject.map((users) => users.save());
  await Promise.all(promiseArray);
});

describe("Testing the routes belonging to the entity: users", () => {
  test("receive response in json", async () => {
    await api.get(endpoint).expect("Content-Type", /json/).expect(200);
  });

  test("check if the 'posts' property exists", async () => {
    const data = await helper.usersInDb();
    data.map((item) => expect(item.posts).toBeDefined());
  });
  test("list of users increases by one when /POST request", async () => {
    await api.post(endpoint).send(helper.usersExamples.good).expect(201);
    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(helper.initialUsers.length + 1);
  });
  test("api prevents a bad document to be added", async () => {
    await api.post(endpoint).send(helper.usersExamples.bad).expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
