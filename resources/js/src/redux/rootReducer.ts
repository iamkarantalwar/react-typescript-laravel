import { combineReducers } from "redux";
import usersReducer from "./user/userReducer";
import webTitleReducer from "./web-title/webTitleReducer";
import roomsReducer from "./rooms/roomsReducer";
import projectReducer from "./project/projectReducer";
import projectSettingsReducer from "./project-settings/projectSettingsReducer";

const rootReducer = combineReducers({
    users: usersReducer,
    title: webTitleReducer,
    rooms: roomsReducer,
    project: projectReducer,
    projectSettings: projectSettingsReducer
});

export default rootReducer;