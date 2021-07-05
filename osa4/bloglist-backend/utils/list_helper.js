const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  const total = blogs.reduce((prev, next) => prev + next.likes, 0);
  return blogs.length === 0 ? 0 : total;
};

const favoriteBlog = (blogs) => {
  const getFav = blogs.reduce((prev, next) => Math.max(prev, next.likes), 0);
  const entry = blogs.find((blog) => blog.likes === getFav);
  return entry;
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const uniq = authors.filter((author, pos) => authors.indexOf(author) === pos);
  let authorBlogsCount = [];
  for (let i = 0; i < uniq.length; i++) {
    authorBlogsCount[i] = authors.filter((person) => person === uniq[i]).length;
  }
  const mostBlogCount = authorBlogsCount.indexOf(Math.max(...authorBlogsCount));
  const returnObject = {
    author: uniq[mostBlogCount],
    blogs: Math.max(...authorBlogsCount),
  };
  return returnObject;
};

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const uniq = authors.filter((author, pos) => authors.indexOf(author) === pos);
  let authorLikesCount = new Array(uniq.length).fill(0);
  for (let i = 0; i < uniq.length; i++) {
    let oneAuthorBlogs = blogs.filter((blog) => blog.author === uniq[i]);
    for (let j = 0; j < oneAuthorBlogs.length; j++) {
      authorLikesCount[i] += oneAuthorBlogs[j].likes;
    }
  }
  const mostLikedAuthor = authorLikesCount.indexOf(
    Math.max(...authorLikesCount)
  );
  const returnObject = {
    author: uniq[mostLikedAuthor],
    likes: Math.max(...authorLikesCount),
  };
  return returnObject;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
