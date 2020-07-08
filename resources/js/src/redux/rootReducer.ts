import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import webTitleReducer from "./web-title/webTitleReducer";

const rootReducer = combineReducers({
    user: userReducer,
    title: webTitleReducer,
});

export default rootReducer;