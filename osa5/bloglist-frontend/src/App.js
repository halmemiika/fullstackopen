import React, { useState, useEffect, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import { setNotification } from "./reducers/notificationReducer";
import { getAllBlogs, createBlog } from "./reducers/blogReducer";
import { logInUser, logOutUser } from "./reducers/userReducer";
import { getAllUsers } from "./reducers/usersReducer";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import {
  CssBaseline,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  Paper,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";

import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import Blogs from "./components/Blogs";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import BlogDetails from "./components/BlogDetails";

import loginService from "./services/login";
import storage from "./utils/storage";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(4),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    paddingLeft: "80px",
  },
  createBlog: {
    marginTop: theme.spacing(0),
  },
}));

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const blogFormRef = useRef();
  const dispatch = useDispatch();

  const loggedInUser = useSelector((state) => state.user);

  const classes = useStyles();

  useEffect(() => {
    dispatch(getAllBlogs());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    const user = storage.loadUser();
    dispatch(logInUser(user));
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      dispatch(logInUser(user));
      storage.saveUser(user);
      dispatch(
        setNotification({
          message: `Welcome back ${user.name}`,
          class: "success",
        })
      );
      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatch(
        setNotification({
          message: "wrong username or password",
          class: "error",
        })
      );
    }
  };

  const handleNewBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    dispatch(createBlog(blogObject));
    dispatch(
      setNotification({
        message: `a new blog ${blogObject.title} by ${blogObject.author} added`,
        class: "success",
      })
    );
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
    dispatch(logOutUser());
    storage.logoutUser();
  };

  const createBlogForm = () => (
    <Container maxWidth="xs">
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleNewBlog} />
      </Togglable>
    </Container>
  );

  if (!loggedInUser) {
    return (
      <Container maxWidth="xs">
        <CssBaseline />
        <Paper className={classes.paper} elevation={3}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography variant="h5">log in to application</Typography>
          <Notification />
          <div>{loginForm()}</div>
        </Paper>
      </Container>
    );
  } else {
    return (
      <Container>
        <CssBaseline />
        <Router>
          <AppBar position="static">
            <Toolbar className={classes.toolbar}>
              <div>
                <Button color="inherit" component={Link} to="/">
                  Blogs
                </Button>
                <Button color="inherit" component={Link} to="/users">
                  users
                </Button>
              </div>
              <Typography variant="h4" className={classes.title}>
                Blog App
              </Typography>
              <div>
                {loggedInUser.name} logged in
                <Button onClick={handleLogout} color="secondary">
                  logout
                </Button>
              </div>
            </Toolbar>
          </AppBar>

          <Notification />
          <Switch>
            <Route path="/blogs/:id">
              <BlogDetails />
            </Route>
            <Route path="/users/:id">
              <UserBlogs />
            </Route>
            <Route path="/users">
              <Users />
            </Route>
            <Route path="/">
              <div className={classes.createBlog}>{createBlogForm()}</div>
              <Blogs />
            </Route>
          </Switch>
        </Router>
      </Container>
    );
  }
};

export default App;
