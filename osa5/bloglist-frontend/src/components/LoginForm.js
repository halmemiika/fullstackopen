import React from "react";
import PropTypes from "prop-types";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const LoginForm = ({
  handleLogin,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password,
}) => {
  const classes = useStyles();
  return (
    <form onSubmit={handleLogin} className={classes.form}>
      <div>
        <TextField
          id="username"
          value={username}
          onChange={handleUsernameChange}
          label="username"
          variant="outlined"
          required
          margin="normal"
        />
      </div>
      <div>
        <TextField
          id="password"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          label="password"
          variant="outlined"
          required
          margin="normal"
        />
      </div>
      <Button
        id="login-button"
        type="submit"
        variant="contained"
        color="primary"
        className={classes.submit}
        fullWidth
      >
        login
      </Button>
    </form>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginForm;
