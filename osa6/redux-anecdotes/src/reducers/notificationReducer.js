const notificationReducer = (state = "", action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.data.notification;
    default:
      return state;
  }
};

export const setNotification = (notification, delay) => {
  const showNotification = (text) => {
    return { type: "SET_NOTIFICATION", data: { notification: text } };
  };

  return async (dispatch) => {
    dispatch(showNotification(notification));
    setTimeout(() => {
      dispatch(showNotification(""));
    }, delay * 1000);
  };
};

export default notificationReducer;
