import React, { useState, useImperativeHandle } from "react";

const Blog = React.forwardRef((props, ref) => {
  const { blog, handleLikes } = props;
  const [fullDetails, setFullDetails] = useState(false);

  const hideWhenVisible = { display: fullDetails ? "none" : "" };
  const showWhenVisible = { display: fullDetails ? "" : "none" };

  const toggleDetails = () => {
    setFullDetails(!fullDetails);
  };

  useImperativeHandle(ref, () => {
    console.log(blog);
    return {
      blog,
    };
  });

  return (
    <>
      <div className="blogStyle" style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button className="button" onClick={toggleDetails}>
          view
        </button>
      </div>
      <div className="blogStyle" style={showWhenVisible}>
        <div>
          {blog.title} <button onClick={toggleDetails}>hide</button>
        </div>
        {blog.url}
        <div>
          {blog.likes}
          <button onClick={handleLikes}>like</button>
        </div>
        {blog.author}
      </div>
    </>
  );
});

export default Blog;
