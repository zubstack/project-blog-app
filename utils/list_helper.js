const Post = require("../models/post");

/* eslint-disable no-prototype-builtins */
function totalLikes(posts) {
  return posts
    .map((post) => post.likes)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
}

function favoriteBlog(posts) {
  if (posts.length === 0) {
    return null;
  }
  const mostLikedBook = posts.reduce((maxLiked, currentBook) => {
    return currentBook.likes > maxLiked.likes ? currentBook : maxLiked;
  }, posts[0]);
  const { title, author, likes } = mostLikedBook;
  return { title, author, likes };
}

function mostBlogs(posts) {
  const authors = {};
  posts.map((item) => {
    if (!authors.hasOwnProperty(item.author)) {
      authors[item.author] = 1;
    } else {
      authors[item.author] += 1;
    }
  });
  let biggestAuthor = Object.keys(authors).reduce(function (a, b) {
    return authors[a] > authors[b] ? a : b;
  });
  let biggestValue = authors[biggestAuthor];

  return { author: biggestAuthor, blogs: biggestValue };
}

function mostLikedAuthor(posts) {
  if (posts.length === 0) {
    return null;
  }
  const mostLikedBook = posts.reduce((maxLiked, currentBook) => {
    return currentBook.likes > maxLiked.likes ? currentBook : maxLiked;
  }, posts[0]);
  const { author, likes } = mostLikedBook;
  return { author, likes };
}

async function postsInDb() {
  const posts = await Post.find({});
  return posts.map((item) => item.toJSON());
}

const postsExamples = {
  good: {
    title: "Hello world",
    author: "Zubstack",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 8,
  },
  bad: {
    author: "Multialejo",
  },
};

const initialPosts = [
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
];

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedAuthor,
  initialPosts,
  postsExamples,
  postsInDb,
};
