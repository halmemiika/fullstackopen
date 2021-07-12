import React from "react";

const BlogForm = ({
  onSubmit,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
  titleValue,
  authorValue,
  urlValue,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <h2>create new</h2>
      <div>
        title:
        <input value={titleValue} onChange={handleTitleChange} />
      </div>
      <div>
        author:
        <input value={authorValue} onChange={handleAuthorChange} />
      </div>
      <div>
        url:
        <input value={urlValue} onChange={handleUrlChange} />
      </div>
      <button type="submit">save</button>
    </form>
  );
};

export default BlogForm;
