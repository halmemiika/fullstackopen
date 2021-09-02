import React from "react";
import { useSelector } from "react-redux";
import {
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  title: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing(4),
  },
  author: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs);
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h4" className={classes.title}>
        Blogs
      </Typography>
      <TableContainer component={Paper} className={classes.paper} elevation={3}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Blog Title</Typography>
              </TableCell>
              <TableCell className={classes.author}>
                <Typography variant="h6">Blog Author</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blogs.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell className={classes.author}>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Blogs;
