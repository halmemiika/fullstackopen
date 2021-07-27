import React, { useState } from "react";

const Blog = ({ blog, handleLikes, handleDeletion, user }) => {
  const [fullDetails, setFullDetails] = useState(false);
  const [logged, setLogged] = useState(false);

  const hideWhenVisible = { display: fullDetails ? "none" : "" };
  const showWhenVisible = { display: fullDetails ? "" : "none" };
  const showWhenLogged = { display: logged ? "" : "none" };

  const toggleDetails = () => {
    setFullDetails(!fullDetails);
    const blogUser = blog.user.id ? blog.user.id : blog.user;
    if (user.id === blogUser) {
      setLogged(true);
    }
  };

  return (
    <>
      <div id="closedBlog" className="blogStyle" style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button className="button" onClick={toggleDetails}>
          view
        </button>
      </div>
      <div id="openBlog" className="blogStyle" style={showWhenVisible}>
        <div>
          {blog.title} <button onClick={toggleDetails}>hide</button>
        </div>
        {blog.url}
        <div>
          likes {blog.likes}
          <button id={blog.id} onClick={handleLikes}>
            like
          </button>
        </div>
        {blog.author}
        <div style={showWhenLogged}>
          <button id={blog.id} onClick={handleDeletion}>
            remove
          </button>
        </div>
      </div>
    </>
  );
};

export default Blog;
