import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
  amount: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

const Users = () => {
  const users = useSelector((state) => state.users);
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h4" className={classes.title}>
        Users
      </Typography>
      <TableContainer component={Paper} className={classes.paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">User</Typography>
              </TableCell>
              <TableCell className={classes.amount}>
                <Typography variant="h6">Blogs created</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow user={user} key={user.id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}>
                    {user.name ? user.name : user.username}
                  </Link>
                </TableCell>
                <TableCell className={classes.amount}>
                  {user.blogs.length ? user.blogs.length : 0}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
