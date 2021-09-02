import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, TextField, Button, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: theme.spacing(4),
  },
  title: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
}));

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const classes = useStyles();

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
      <Paper elevation={3} className={classes.paper}>
        <Typography variant="h5" className={classes.title}>
          Create a new Blog
        </Typography>
        <TextField
          id="title"
          value={newTitle}
          onChange={handleTitleChange}
          label="title"
          variant="outlined"
          required
          margin="dense"
          multiline
        />
        <TextField
          id="author"
          value={newAuthor}
          onChange={handleAuthorChange}
          label="author"
          variant="outlined"
          required
          margin="dense"
        />
        <TextField
          id="url"
          value={newUrl}
          onChange={handleUrlChange}
          label="url"
          variant="outlined"
          required
          margin="dense"
        />
        <Button type="submit" variant="contained" color="primary">
          save
        </Button>
      </Paper>
    </form>
  );
};

export default BlogForm;
