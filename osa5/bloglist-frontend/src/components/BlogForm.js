import React, { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const handleAuthorChange = (e) => {
    setNewAuthor(e.target.value);
  };
  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };
  const handleUrlChange = (e) => {
    setNewUrl(e.target.value);
  };

  const addBlog = (e) => {
    e.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });

    setNewAuthor("");
    setNewTitle("");
    setNewUrl("");
  };

  return (
    <form onSubmit={addBlog}>
      <h2>create new</h2>
      <div>
        title:
        <input id="title" value={newTitle} onChange={handleTitleChange} />
      </div>
      <div>
        author:
        <input id="author" value={newAuthor} onChange={handleAuthorChange} />
      </div>
      <div>
        url:
        <input id="url" value={newUrl} onChange={handleUrlChange} />
      </div>
      <button type="submit">save</button>
    </form>
  );
};

export default BlogForm;
