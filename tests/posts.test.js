const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const helper = require("../utils/list_helper");
const Post = require("../models/post");

const api = request(app);
const endpoint = "/api/posts";

beforeEach(async () => {
  await Post.deleteMany({});

  const postsObject = helper.initialPosts.map((item) => new Post(item));
  const promiseArray = postsObject.map((post) => post.save());
  await Promise.all(promiseArray);
});

describe("Trying testing", () => {
  test("when list has only one post, equals the likes of that", () => {
    const result = helper.totalLikes(helper.initialPosts);
    expect(result).toBe(17);
  });
  test("give the most popular blog from the bloglist", () => {
    const result = helper.favoriteBlog(helper.initialPosts);
    const { title, author, likes } = helper.initialPosts[1];
    expect(result).toEqual({ title, author, likes });
  });
  test("the author with the most quantity of blogs", () => {
    const result = helper.mostBlogs(helper.initialPosts);
    expect(result).toEqual({ author: "Robert C. Martin", blogs: 2 });
  });
  test("the most liked author", () => {
    const result = helper.mostLikedAuthor(helper.initialPosts);
    console.log("result", result);
    const { author, likes } = helper.initialPosts[1];
    expect(result).toEqual({ author, likes });
  });
});

describe("/all posts", () => {
  test("receive response in json", async () => {
    const response = await api
      .get(endpoint)
      .expect("Content-Type", /json/)
      .expect(200);
    console.log("response", response.body);
  });
  test("check if the 'id' property exists on the response objects", async () => {
    const data = await helper.postsInDb();
    data.map((item) => expect(item.id).toBeDefined());
  });
  test("list of posts increases by one when /POST request", async () => {
    await api.post(endpoint).send(helper.postsExamples.good).expect(201);
    const postsAtEnd = await helper.postsInDb();
    expect(postsAtEnd).toHaveLength(helper.initialPosts.length + 1);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
