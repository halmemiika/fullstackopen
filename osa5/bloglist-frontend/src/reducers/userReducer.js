const userReducer = (state = null, action) => {
  switch (action.type) {
    case "LOG_IN":
      return action.data;
    case "LOG_OUT":
      return null;

    default:
      return state;
  }
};

export const logInUser = (user) => {
  return async (dispatch) => {
    dispatch({
      type: "LOG_IN",
      data: user,
    });
  };
};

export const logOutUser = () => {
  return async (dispatch) => {
    dispatch({
      type: "LOG_OUT",
    });
  };
};

export default userReducer;
