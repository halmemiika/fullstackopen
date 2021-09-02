import React, { useState } from "react";
import { useParams, useHistory } from "react-router";
import { useSelector, useDispatch } from "react-redux";

import { likeBlog, deleteBlog } from "../reducers/blogReducer";
import { setNotification } from "../reducers/notificationReducer";

import blogService from "../services/blogs";

import {
  TextField,
  Button,
  Link,
  Typography,
  Grid,
  Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    marginTop: theme.spacing(8),
  },
  title: {
    textAlign: "center",
  },
  cardDetails: {
    padding: theme.spacing(1),
  },
  likeButton: {
    marginLeft: theme.spacing(1),
  },
  form: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "30px",
  },
}));

const BlogDetails = () => {
  const params = useParams();
  const blogs = useSelector((state) => state.blogs);
  const currentBlog = blogs.find((blog) => blog.id === params.id);
  const loggedUser = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const history = useHistory();

  const [comment, setComment] = useState("");

  const classes = useStyles();

  const deleteBlogHandler = () => {
    const confirm = window.confirm(
      `Remove blog ${currentBlog.title} by ${currentBlog.author}`
    );
    if (confirm) {
      dispatch(deleteBlog(currentBlog.id));
      dispatch(
        setNotification({
          message: `Blog ${currentBlog.title} by ${currentBlog.author} deleted`,
          class: "success",
        })
      );
      history.push("/");
    }
  };

  if (!currentBlog) return null;

  const randomKeys = () => {
    return Math.floor(Math.random() * 10000);
  };

  const addCommentHandler = (e) => {
    e.preventDefault();
    const commentObject = {
      comments: comment,
    };
    blogService.addComment(currentBlog.id, commentObject);
    setComment("");
  };

  return (
    <Grid container className={classes.card} spacing={4}>
      <Grid item component={Paper} xs={12} sm={6} elevation={3}>
        <Typography className={classes.title} variant="h4">
          {currentBlog.title}
        </Typography>
        <Typography className={classes.title} variant="h5">
          by {currentBlog.author}
        </Typography>
        <Grid container>
          <Grid
            container
            direction="column"
            xs={6}
            className={classes.cardDetails}
          >
            <Grid item>
              <Link
                href={currentBlog.url}
                component={Typography}
                variant="body1"
              >
                {currentBlog.url}
              </Link>
            </Grid>
            <Grid item>
              <Typography variant="body1">
                {currentBlog.likes} likes
                <Button
                  onClick={() => dispatch(likeBlog(currentBlog.id))}
                  variant="contained"
                  color="primary"
                  className={classes.likeButton}
                >
                  like
                </Button>
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            direction="column"
            xs={6}
            alignItems="flex-end"
            className={classes.cardDetails}
          >
            <Grid item>
              <Typography variant="body1">
                Added by{" "}
                {loggedUser.id === currentBlog.user.id
                  ? "me"
                  : currentBlog.user.name}
              </Typography>
            </Grid>
            <Grid item>
              {loggedUser.id === currentBlog.user.id ? (
                <Button
                  onClick={deleteBlogHandler}
                  variant="contained"
                  color="secondary"
                >
                  delete
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item component={Paper} xs={12} sm={6}>
        <Typography variant="h4" className={classes.title}>
          Comments
        </Typography>
        <form onSubmit={addCommentHandler} className={classes.form}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            label="Comment"
            variant="outlined"
            margin="normal"
            multiline
          />
          <Button type="submit" variant="contained" color="primary">
            add comment
          </Button>
        </form>

        {currentBlog.comments.length ? (
          <ul>
            {currentBlog.comments.map((comment) =>
              !comment ? null : (
                <Typography
                  component="li"
                  variant="subtitle1"
                  key={randomKeys()}
                >
                  {comment}
                </Typography>
              )
            )}
          </ul>
        ) : null}
      </Grid>
    </Grid>
  );
};

export default BlogDetails;
