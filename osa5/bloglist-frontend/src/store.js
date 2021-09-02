import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import blogReducer from "./reducers/blogReducer";
import notificationReducer from "./reducers/notificationReducer";
import userReducer from "./reducers/userReducer";
import usersReducer from "./reducers/usersReducer";

const reducer = combineReducers({
  blogs: blogReducer,
  notification: notificationReducer,
  user: userReducer,
  users: usersReducer,
});

export default createStore(reducer, applyMiddleware(thunk));
