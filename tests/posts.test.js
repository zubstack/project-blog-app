const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const helper = require("../utils/list_helper");
const Post = require("../models/post");

const api = request(app);
const endpoint = "/api/posts";

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
    const { author, likes } = helper.initialPosts[1];
    expect(result).toEqual({ author, likes });
  });
});

describe("Testing the routes belonging to the entity: posts", () => {
  beforeEach(async () => {
    await Post.deleteMany({});

    const postsObject = helper.initialPosts.map((item) => new Post(item));
    const promiseArray = postsObject.map((post) => post.save());
    await Promise.all(promiseArray);
  });

  test("receive response in json", async () => {
    await api.get(endpoint).expect("Content-Type", /json/).expect(200);
  });
  test("check if the 'id' property exists on the response objects", async () => {
    const data = await helper.postsInDb();
    data.map((item) => expect(item.id).toBeDefined());
  });
  test("check if the 'likes' property exists and has the value of 0", async () => {
    const data = await helper.postsInDb();
    data.map((item) => expect(item.likes).toEqual(0));
  });
  test("list of posts increases by one when /POST request", async () => {
    await api.post(endpoint).send(helper.postsExamples.good).expect(201);
    const postsAtEnd = await helper.postsInDb();
    expect(postsAtEnd).toHaveLength(helper.initialPosts.length + 1);
  });
  test("api prevents a bad document to be added", async () => {
    await api.post(endpoint).send(helper.postsExamples.bad).expect(400);
  });
  test("one document is deleted from db when /DELETE request", async () => {
    const postsAtStart = await helper.postsInDb();
    await api.delete(`${endpoint}/${postsAtStart[0].id}`).expect(201);
    const postsAtEnd = await helper.postsInDb();
    expect(postsAtEnd).toHaveLength(helper.initialPosts.length - 1);
  });
  test("one document is modified from db when /PUT request", async () => {
    const [postToUpdate] = await helper.postsInDb(); // Have the first item
    await api
      .put(`${endpoint}/${postToUpdate.id}`)
      .send({
        likes: 9,
      })
      .expect(201);
    const postsAtEnd = await helper.postsInDb();
    const updatedPost = postsAtEnd.find((item) => postToUpdate.id === item.id);
    expect(updatedPost.likes).toEqual(9);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
