const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const helper = require("../utils/list_helper");
const Post = require("../models/post");

const api = request(app);

beforeEach(async () => {
  await Post.deleteMany({});

  let postObject = new Post(helper.initialPosts[0]);
  await postObject.save();

  postObject = new Post(helper.initialPosts[1]);
  await postObject.save();
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
    await api.get("/api/posts").expect("Content-Type", /json/).expect(200);
  });
  test("check if the 'id' property exists on the response objects", async () => {
    const response = await api.get("/api/posts");
    const data = response.body;
    data.map((item) => expect(item.id).toBeDefined());
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
