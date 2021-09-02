import React from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
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
  subtitle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  centerText: {
    textAlign: "center",
  },
  link: {
    textDecoration: "none",
  },
  noBlogs: {
    textAlign: "center",
    padding: theme.spacing(2, 0),
  },
}));

const UserBlogs = () => {
  const params = useParams();
  const users = useSelector((state) => state.users);

  const currentUser = users.find((user) => user.id === params.id);

  const classes = useStyles();

  if (!currentUser) return null;

  return (
    <div>
      <Typography variant="h4" className={classes.title}>
        {currentUser.name}
      </Typography>
      <TableContainer component={Paper} className={classes.paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h5" className={classes.subtitle}>
                  Added blogs
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          {currentUser.blogs.length ? (
            <TableBody>
              {currentUser.blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className={classes.centerText}>
                    <Link to={`/blogs/${blog.id}`} className={classes.link}>
                      {blog.title}
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <Typography
              variant="body1"
              className={classes.noBlogs}
              gutterBottom
            >
              No added blogs yet
            </Typography>
          )}
        </Table>
      </TableContainer>
    </div>
  );
};

export default UserBlogs;
