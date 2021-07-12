import React from "react";

const Notification = ({ message, messageClass }) => {
  if (message === null) {
    return null;
  } else if (messageClass === "success") {
    return <div className="success">{message}</div>;
  } else if (messageClass === "error") {
    return <div className="error">{message}</div>;
  }
};

export default Notification;
