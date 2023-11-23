const listHelper = require("../utils/list_helper");

describe("total likes", () => {
  const listWithPosts = [
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0,
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0,
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0,
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Alberto Espinoza",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0,
    },
  ];

  test("when list has only one post, equals the likes of that", () => {
    const result = listHelper.totalLikes(listWithPosts);
    expect(result).toBe(17);
  });

  describe("favorite", () => {
    test("give the most popular blog from the bloglist", () => {
      const result = listHelper.favoriteBlog(listWithPosts);
      const { title, author, likes } = listWithPosts[1];
      expect(result).toEqual({ title, author, likes });
    });
    test("the author with the most quantity of blogs", () => {
      const result = listHelper.mostBlogs(listWithPosts);
      expect(result).toEqual({ author: "Robert C. Martin", blogs: 2 });
    });
    test("the most liked author", () => {
      const result = listHelper.mostLikedAuthor(listWithPosts);
      console.log("result", result);
      const { author, likes } = listWithPosts[1];
      expect(result).toEqual({ author, likes });
    });
  });
});
