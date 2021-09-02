import React, { useState, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <>
      <div style={{ display: visible ? "none" : "flex" }}>
        <Button
          id="loginForm-button"
          onClick={toggleVisibility}
          variant="contained"
          color="primary"
          fullWidth
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div
        style={{ display: visible ? "flex" : "none", flexDirection: "column" }}
      >
        {props.children}
        <Button
          id="loginForm-button"
          onClick={toggleVisibility}
          variant="contained"
          color="secondary"
        >
          cancel
        </Button>
      </div>
    </>
  );
});

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

export default Togglable;
