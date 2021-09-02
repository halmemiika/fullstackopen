const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.data;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

let timeoutId;

export const setNotification = (content) => {
  return async (dispatch) => {
    dispatch({
      type: "SET_NOTIFICATION",
      data: content,
    });

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      dispatch({
        type: "CLEAR_NOTIFICATION",
      });
    }, 5000);
  };
};

export default notificationReducer;
