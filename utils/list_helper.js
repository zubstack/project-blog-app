const totalLikes = (posts) => {
  return posts
    .map((post) => post.likes)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
};

module.exports = {
  totalLikes,
};
