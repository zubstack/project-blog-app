const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

const postsHelper = require("../utils/list_helper");
const usersHelper = require("../utils/user_helper");

const Post = require("../models/post");
const User = require("../models/user");

const api = request(app);
const endpoint = "/api/posts";

describe("Trying testing", () => {
  test("when list has only one post, equals the likes of that", () => {
    const result = postsHelper.totalLikes(postsHelper.initialPosts);
    expect(result).toBe(17);
  });
  test("give the most popular blog from the bloglist", () => {
    const result = postsHelper.favoriteBlog(postsHelper.initialPosts);
    const { title, author, likes } = postsHelper.initialPosts[1];
    expect(result).toEqual({ title, author, likes });
  });
  test("the author with the most quantity of blogs", () => {
    const result = postsHelper.mostBlogs(postsHelper.initialPosts);
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 2 });
  });
  test("the most liked author", () => {
    const result = postsHelper.mostLikedAuthor(postsHelper.initialPosts);
    const { author, likes } = postsHelper.initialPosts[1];
    expect(result).toEqual({ author, likes });
  });
});

describe("Testing the routes belonging to the entity: posts", () => {
  beforeEach(async () => {
    //The number of initial users MUST TO BE EQUAL to initial posts

    await Post.deleteMany({});
    await User.deleteMany({});

    const usersObject = usersHelper.initialUsers.map((user) => new User(user));
    const usersPromise = usersObject.map((user) => user.save());
    await Promise.all(usersPromise);

    const result = await usersHelper.usersInDb();

    postsHelper.initialPosts.map((item, index) => {
      item.user = result[index].id;
    });

    const postsObject = postsHelper.initialPosts.map((item) => new Post(item));
    const postsPromises = postsObject.map((post) => post.save());
    await Promise.all(postsPromises);
  });

  async function getTokenFromUser() {
    const { username, password } = usersHelper.initialUsers[1];
    const result = await api.post("/api/login").send({ username, password });
    return result.body.token;
  }

  test("receive response in json", async () => {
    await api.get(endpoint).expect("Content-Type", /json/).expect(200);
  });
  test("check if the 'id' property exists on the response objects", async () => {
    const data = await postsHelper.postsInDb();
    data.map((item) => expect(item.id).toBeDefined());
  });
  test("check if the 'likes' property exists and has the value of 0", async () => {
    const data = await postsHelper.postsInDb();
    data.map((item) => expect(item.likes).toEqual(0));
  });
  test("fails when no token authenticator is sent", async () => {
    await api.post(endpoint).send(postsHelper.postsExamples.good).expect(401);
  });
  test("list of posts increases by one when /POST request", async () => {
    const token = await getTokenFromUser();

    await api
      .post(endpoint)
      .send(postsHelper.postsExamples.good)
      .set("Authorization", "Bearer " + token)
      .expect(201);
    const postsAtEnd = await postsHelper.postsInDb();
    expect(postsAtEnd).toHaveLength(postsHelper.initialPosts.length + 1);
  });
  test("api prevents a bad document to be added", async () => {
    const token = await getTokenFromUser();

    await api
      .post(endpoint)
      .send(postsHelper.postsExamples.bad)
      .set("Authorization", "Bearer " + token)
      .expect(400);
  });
  test("one document is deleted from db when /DELETE request", async () => {
    const token = await getTokenFromUser();

    const postsAtStart = await postsHelper.postsInDb();
    await api
      .delete(`${endpoint}/${postsAtStart[1].id}`)
      .set("Authorization", "Bearer " + token)
      .expect(201);
    const postsAtEnd = await postsHelper.postsInDb();
    expect(postsAtEnd).toHaveLength(postsHelper.initialPosts.length - 1);
  });
  test("one document is modified from db when /PUT request", async () => {
    const [postToUpdate] = await postsHelper.postsInDb();
    await api
      .put(`${endpoint}/${postToUpdate.id}`)
      .send({
        likes: 9,
      })
      .expect(201);
    const postsAtEnd = await postsHelper.postsInDb();
    const updatedPost = postsAtEnd.find((item) => postToUpdate.id === item.id);
    expect(updatedPost.likes).toEqual(9);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
