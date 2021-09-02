import userService from "../services/users";

const usersReducer = (state = [], action) => {
  switch (action.type) {
    case "ALL_USERS":
      return action.data;
    default:
      return state;
  }
};

export const getAllUsers = () => {
  return async (dispatch) => {
    const users = await userService.users();
    dispatch({
      type: "ALL_USERS",
      data: users,
    });
  };
};

export default usersReducer;
