import React, { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [errorMessage, setErrorMessage] = useState(null);
  const [messageClass, setMessageClass] = useState("success");

  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const blogFormRef = useRef();
  const oneBlogRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setMessageClass("error");
      setErrorMessage("wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
        setMessageClass("success");
      }, 5000);
    }
  };

  const handleNewBlog = (e) => {
    e.preventDefault();
    const newBlog = {
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    };
    blogFormRef.current.toggleVisibility();
    blogService
      .create(newBlog)
      .then((returnedBlog) => blogs.concat(returnedBlog));
    setNewTitle("");
    setNewAuthor("");
    setNewUrl("");
    setErrorMessage(`a new blog ${newTitle} by ${newAuthor} added`);
    setTimeout(() => {
      setErrorMessage(null);
      window.location.reload();
    }, 5000);
  };

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleLogin={handleLogin}
      />
    </Togglable>
  );

  const handleLogout = () => {
    window.localStorage.clear();
    window.location.reload();
  };

  const handleLikes = (e) => {
    const blogToUpdate = oneBlogRef.current.blog;
    const newBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };
    blogService
      .update(blogToUpdate.id, newBlog)
      .then((returnedBlog) =>
        setBlogs(
          blogs.map((blog) =>
            blog.id !== blogToUpdate.id ? blog : returnedBlog
          )
        )
      );
  };

  const allBlogs = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm
        onSubmit={handleNewBlog}
        titleValue={newTitle}
        authorValue={newAuthor}
        urlValue={newUrl}
        handleTitleChange={({ target }) => setNewTitle(target.value)}
        handleAuthorChange={({ target }) => setNewAuthor(target.value)}
        handleUrlChange={({ target }) => setNewUrl(target.value)}
      />
    </Togglable>
  );

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={errorMessage} messageClass={messageClass} />
        <div>{loginForm()}</div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.name} logged in
          <button onClick={handleLogout}>logout</button>
        </p>
        <Notification message={errorMessage} messageClass={messageClass} />
        <div>{allBlogs()}</div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            handleLikes={handleLikes}
            ref={oneBlogRef}
          />
        ))}
      </div>
    );
  }
};

export default App;
