import blogService from "../services/blogs";

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case "ALL_BLOGS":
      return action.data;
    case "NEW_BLOG":
      return [...state, action.data];
    case "LIKE_BLOG": {
      const id = action.data.id;
      const blogToLike = state.find((b) => b.id === id);
      const updatedBlog = {
        ...blogToLike,
        likes: blogToLike.likes + 1,
      };
      const allBlogs = state.map((blog) =>
        blog.id !== id ? blog : updatedBlog
      );
      return allBlogs.sort((a, b) => (a.likes < b.likes ? 1 : -1));
    }
    case "DELETE_BLOG": {
      const id = action.data.id;
      blogService.remove(id);
      return state.filter((blog) => blog.id !== id);
    }
    default:
      return state;
  }
};

export const getAllBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    const sorted = blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1));
    dispatch({
      type: "ALL_BLOGS",
      data: sorted,
    });
  };
};

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogService.create(content);
    dispatch({
      type: "NEW_BLOG",
      data: newBlog,
    });
  };
};

export const likeBlog = (id) => {
  return {
    type: "LIKE_BLOG",
    data: { id },
  };
};

export const deleteBlog = (id) => {
  return {
    type: "DELETE_BLOG",
    data: { id },
  };
};

export default blogReducer;
