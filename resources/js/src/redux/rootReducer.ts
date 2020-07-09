import { combineReducers } from "redux";
import userReducer from "./user/userReducer";
import webTitleReducer from "./web-title/webTitleReducer";
import roomsReducer from "./rooms/roomsReducer";
import projectReducer from "./project/projectReducer";

const rootReducer = combineReducers({
    user: userReducer,
    title: webTitleReducer,
    rooms: roomsReducer,
    project: projectReducer,
});

export default rootReducer;