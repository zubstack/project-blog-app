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

const initialPosts = [
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

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedAuthor,
  initialPosts,
};
