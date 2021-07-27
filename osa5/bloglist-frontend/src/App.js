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

  const blogFormRef = useRef();

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) =>
        setBlogs(blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1)))
      );
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

  const handleNewBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService
      .create(blogObject)
      .then((returnedBlog) => setBlogs(blogs.concat(returnedBlog)));
    setErrorMessage(
      `a new blog ${blogObject.title} by ${blogObject.author} added`
    );
    setTimeout(() => {
      setErrorMessage(null);
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
    const blogToUpdate = blogs.find((blog) => blog.id === e.target.id);
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
    sortBlogs();
  };

  const handleDeletion = (e) => {
    const id = e.target.id;
    const blogToDelete = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(
        `Remove blog ${blogToDelete.title} by ${blogToDelete.author}`
      )
    ) {
      blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      setErrorMessage(
        `Blog ${blogToDelete.title} by ${blogToDelete.author} deleted`
      );
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const sortBlogs = () => {
    const sorted = blogs.sort((a, b) => (a.likes < b.likes ? 1 : -1));
    setBlogs(sorted);
  };

  const allBlogs = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef}>
      <BlogForm createBlog={handleNewBlog} />
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
            handleDeletion={handleDeletion}
            user={user}
          />
        ))}
      </div>
    );
  }
};

export default App;
